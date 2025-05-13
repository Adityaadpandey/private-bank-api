import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { config } from './config';
import logger from './config/logger';
import { setupGracefulShutdown } from './utils/shutdown';

import helmet from 'helmet';
import { errorHandler } from './middlewares/error.middleware';
import { reqLogger } from './middlewares/req.middleware';
import indexRoutes from './routes/index.route';

import { AppDataSource } from './data-source';
import { verifyToken } from './middlewares/auth.middleware';
import { transactionRouter } from './routes/transaction.route';

const app = express();
app.use(helmet());
app.use(express.json());

app.use(reqLogger);
app.use(verifyToken);

app.use('/', indexRoutes);
app.use('/api/v1/transaction', transactionRouter);

app.use(errorHandler);


AppDataSource.initialize()
    .then(() => {
        logger.info('Database connection established successfully');
        try {
            const server = app.listen(config.PORT, () => {
                logger.info(`${config.SERVICE_NAME} running on port ${config.PORT}`);
            });
            // Graceful shutdown
            setupGracefulShutdown(server);
        } catch (error) {
            logger.error('Failed to start server:', error);
            process.exit(1);
        }
    })
