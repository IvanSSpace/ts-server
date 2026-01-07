export interface JwtPayload {
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
}

// Расширяем Request чтобы добавить user
// (это нужно для TypeScript, чтобы он знал про req.user)
declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}
