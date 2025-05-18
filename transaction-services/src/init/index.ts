import { config } from '../config';
import logger from '../config/logger';
import { startConsumers } from '../events/consumers';
import { connectKafka } from '../events/kafka';

export default async () => {
  try {
    await connectKafka();

    await startConsumers();

    logger.info(`${config.SERVICE_NAME} initialized successfully`);
  } catch (error) {
    logger.error(`Failed to initialize ${config.SERVICE_NAME}`, error);
    throw error;
  }
};
