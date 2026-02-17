import { MongoError } from "mongodb";
import { Response } from "express"; 

export const DuplicateKeyErrorHandler = (err: MongoError, res: Response): void => {
  if (err.code === 11000) {
    const field: string = Object.keys((err as any).keyValue)[0];
    res.status(400).json({
      message: `The ${field} already exists. Please use a different value.`,
      error: (err as any).keyValue,
    });
  } else {
    res.status(500).json({ message: 'An unexpected error occurred.' });
  }
};