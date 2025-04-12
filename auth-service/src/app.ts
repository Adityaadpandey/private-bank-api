import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import { config } from './config';
import logger from './config/logger';
import { AppDataSource } from './data-source';

// import helmet from 'helmet';
import init from './init';
import { authRouter } from './routes/auth.router';
// import indexRoute from './routes/index.router';

const app = express();

// app.use(helmet());
app.use(express.json());


// routes
// app.use('/', indexRoute);
app.use('/api/v1/auth/', authRouter);

AppDataSource.initialize()
    .then(async () => {
        await init();
        app.use((req, res, next) => {
            console.log(`[🔥 Incoming] ${req.method} ${req.originalUrl}`);
            next();
        });

        const server = app.listen(config.PORT, () => {
            logger.info(`Auth service listening on port ${config.PORT}`);
        }
        );

    }).catch((error) => {
        logger.error("Error during Data Source initialization", error);
    })
