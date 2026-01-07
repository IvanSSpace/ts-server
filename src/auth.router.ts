import { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import pool from './db';

const authRouter = Router();

authRouter.post(
  '/register',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ error: 'min pass 6 characters' });
        return;
      }

      // Проверка на существующего пользователя в БД
      const existingUser = await pool.query(
        'SELECT id FROM auth_users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        res.status(409).json({ error: 'User with this email already exists' });
        return;
      }

      // Хешируем пароль
      const passwordHash = await bcrypt.hash(
        password,
        Number(process.env.BCRYPT_ROUNDS) || 10
      );

      // Сохраняем пользователя в БД
      const result = await pool.query(
        'INSERT INTO auth_users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
        [email, passwordHash]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

authRouter.post(
  '/login',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const result = await pool.query(
        'SELECT id, email, password_hash FROM auth_users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      const user = result.rows[0];

      // Проверка пароля через bcrypt
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
      );
      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      // Генерация JWT токена
      const jwtSecret = process.env.JWT_SECRET || 'secret';

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        jwtSecret,
        { expiresIn: '15m' }
      );

      res.status(200).json({
        token,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default authRouter;
