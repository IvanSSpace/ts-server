import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import './types';
import { JwtPayload } from './types';

dotenv.config();

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      res.status(401).json({ error: 'Authorization header is missing' });
      return;
    }

    const token = header.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Token is missing' });
      return;
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    req.user = payload as JwtPayload;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expired' });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { authMiddleware };
