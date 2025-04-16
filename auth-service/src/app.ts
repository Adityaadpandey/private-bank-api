import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import { config } from './config';
import logger from './config/logger';
import { AppDataSource } from './data-source';

import helmet from 'helmet';
import init from './init';
import { verifyToken } from './middlewares/auth.middleware';
import { corsMiddleware } from './middlewares/cors.middleware';
import { errorHandler } from './middlewares/error.middleware';
import { reqLogger } from './middlewares/req.middleware';
import { authRouter } from './routes/auth.router';
import indexRoute from './routes/index.router';
import { setupGracefulShutdown } from './utils/shutdown';

const app = express();

app.use(helmet());
app.use(corsMiddleware);

app.use(reqLogger);
app.use(express.json());
app.use(verifyToken);

// routes
app.use('/', indexRoute);
app.use('/api/v1/auth/', authRouter);

app.use(errorHandler);

AppDataSource.initialize()
  .then(async () => {
    await init();

    const server = app.listen(config.PORT, () => {
      logger.info(`Auth service listening on port ${config.PORT}`);
    });
    // Graceful shutdown
    setupGracefulShutdown(server);
  })
  .catch((error) => {
    logger.error('Error during Data Source initialization', error);
  });
