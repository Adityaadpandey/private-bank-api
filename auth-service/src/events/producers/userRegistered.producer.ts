import logger from '../../config/logger';
import { USER_TOPICS } from '../../constant';

import { producer } from '../kafka';

export const publishUserRegisteredEvent = async (data: any) => {
  const topic = USER_TOPICS.USER_REGISTERED;
  logger.info(
    `Publishing event to topic ${topic} with data: ${JSON.stringify(data)}`,
  );

  await producer.send({
    topic,
    messages: [
      {
        key: data.key,
        value: JSON.stringify(data.value),
      },
    ],
  });
};
