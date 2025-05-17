import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { config } from './config';
import logger from './config/logger';
import { AppDataSource } from './data-source';
import init from './init';
import { verifyToken } from './middlewares/auth.middleware';
import { errorHandler } from './middlewares/error.middleware';
import { reqLogger } from './middlewares/req.middleware';
import indexRouter from './routes/index.route';
import { transactionRouter } from './routes/transaction.route';

const app = express();

app.use(reqLogger);
app.use(express.json());
app.use(verifyToken);

app.use('/', indexRouter);
app.use('/api/v1/transactions', transactionRouter);

app.use(errorHandler);

AppDataSource.initialize()
    .then(async () => {
        await init();

        app.listen(config.PORT, () => {
            logger.info(
                `${config.SERVICE_NAME} is running on http://localhost:${config.PORT}`,
            );
        });
    })
    .catch((err) => {
        console.error('Error during Data Source initialization', err);
    });
