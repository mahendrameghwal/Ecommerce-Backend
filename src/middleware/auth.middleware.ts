import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface JwtRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {


    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.SECERET_KEY || '12345') as {
            userId: string;
            role: string;
            type: string;
        };


        // Attach user to request
        (req as any).user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid or expired token'
        });
    }
};
