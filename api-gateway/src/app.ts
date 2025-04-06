import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";

import { config } from "./config";
import logger from "./config/logger";
import { proxyServices } from "./config/services";
import { limiter } from './middleware/rate-limit.middleware';

const app = express();

app.use(helmet());
app.use(cors());
app.use(limiter);


// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.debug(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
})

// health check endpoint
app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
});

// Service Route
proxyServices(app);

// 4040 handler
app.use((req: Request, res: Response) => {
    logger.error(`404 Not Found: ${req.method} ${req.url}`);
    res.status(404).json({ error: "Not Found" });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(`500 Internal Server Error: ${err.message}`);
    res.status(500).json({ error: "Internal Server Error" });
});




const startServer = () => {
    try {
        app.listen(config.PORT, () => {
            logger.info(`${config.SERVICE_NAME} is running on port ${config.PORT}`);
        });
    }
    catch (error) {
        logger.error(`Error starting server: ${error}`);
        process.exit(1);
    };
}

startServer();
