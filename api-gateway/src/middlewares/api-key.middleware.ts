import { NextFunction, Request, Response } from 'express';

export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction): any => {
    const apiKey = req.header('x-api-key');

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
};
