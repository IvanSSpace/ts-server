import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

// Расширение типа Request для добавления поля user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      res.status(401).json({ error: 'Authorization header is missing' });
      return;
    }

    // Формат: "Bearer <token>"
    const token = header.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Token is missing' });
      return;
    }

    // Проверка и декодирование токена
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    // Добавляем данные пользователя в запрос
    req.user = payload;

    // Передаем управление следующему обработчику
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
