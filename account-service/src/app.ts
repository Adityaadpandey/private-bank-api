import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { config } from './config';
import logger from './config/logger';
import { setupGracefulShutdown } from './utils/shutdown';

import helmet from 'helmet';
import { errorHandler } from './middlewares/error.middleware';
import { reqLogger } from './middlewares/req.middleware';
import indexRoutes from './routes/indexRoutes';

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(reqLogger);

app.use('/', indexRoutes);

app.use(errorHandler);

const startServer = () => {
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
};
startServer();
