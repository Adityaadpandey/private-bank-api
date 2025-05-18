import logger from '../../config/logger';
import { producer } from '../kafka';

export interface KafkaMessage<T> {
  key: string;
  value: T;
}

export abstract class BaseProducer<T> {
  protected abstract readonly topic: string;

  async publish(data: KafkaMessage<T>): Promise<void> {
    try {
      logger.info(
        `publishing message to topics: ${this.topic} with message:${JSON.stringify(data)}`,
      );
      await producer.send({
        topic: this.topic,
        messages: [
          {
            key: data.key,
            value: JSON.stringify(data.value),
          },
        ],
      });
    } catch (error) {
      logger.error(
        `Error publishing message to topic: ${this.topic} with error: ${error}`,
      );
      throw error;
    }
  }
}
