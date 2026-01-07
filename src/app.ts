import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { authMiddleware } from './middlewares';
import authRouter from './auth.router';
import pool from './db';

// Загружаем переменные окружения
dotenv.config();

const app = express();

app.use(express.json());

// Подключаем роутер аутентификации все роуты от туда с /auth/
app.use('/auth', authRouter);

app.get('/health', (req: Request, res: Response) => {
  return res.json({ status: 'ok', database: 'connected' });
});

app.get('/users', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, name, created_at FROM users ORDER BY id'
    );
    return res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/users', async (req: Request, res: Response) => {
  try {
    const { name, password } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const result = await pool.query(
      'INSERT INTO users (name, password) VALUES ($1, $2) RETURNING id, name, created_at',
      [name, password || null]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Failed to create user' });
  }
});

app.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, name, password, created_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.get('/me', authMiddleware, (req: Request, res: Response) => {
  return res.status(200).json({
    message: 'Authenticated user',
    user: req.user,
  });
});

app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.message);

  return res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server worked on port: ${PORT}`);
});
