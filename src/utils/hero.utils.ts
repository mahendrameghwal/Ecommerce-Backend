import mongoose from 'mongoose';
import Hero from '../models/Hero.model';
import { gfs } from './gridfs';
import { NextFunction, Request, Response } from 'express';

// Utility to check if file exists in GridFS
export const checkFileExists = async (filename: string) => {
  if (!gfs) throw new Error('GridFS not initialized');
  const file = await gfs.uploads.findOne({ filename });
  return !!file;
};

// Middleware to validate hero IDs
export const validateHeroId = async (req: Request, res: Response, next: NextFunction) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
     res.status(400).json({ message: 'Invalid hero ID format' })
     return;
  }
  
  const hero = await Hero.findById(req.params.id);
  if (!hero) {
     res.status(404).json({ message: 'Hero section not found' })
     return;
  }
  
  // Attach hero to request for later use
(req as any).hero = hero;
  next();
};