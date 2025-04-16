import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import redis from '../config/redis';

const publicRoutes = ['/api/v1/auth/login', '/api/v1/auth/register'];

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  if (publicRoutes.includes(req.path)) {
    return next();
  }
  // console.log(req.headers["authorization"])
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'invalid authorization token in head',
    });
  }

  jwt.verify(token, config.JWT_SECRET, async (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({
        status: 'error',
        message: 'unauthorized',
        err: err.message,
      });
    }
    req.userId = decoded.id;
    req.token = token;

    const redisKey = `auth:${decoded.id}:${token}`;
    const redisToken = await redis.get(redisKey);

    if (!redisToken) {
      return res.status(401).json({
        status: 'error',
        message: 'invalid authorization token in rs',
      });
    }

    next();
  });
};
