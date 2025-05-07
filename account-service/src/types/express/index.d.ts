import 'express';

declare global {
    namespace Express {
        interface Request {
            userId: number;
            token: string;
        }
    }
}
