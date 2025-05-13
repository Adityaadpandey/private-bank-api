interface Config {
  SERVICE_NAME: string;
  PORT: number;
  DATABASE_URL: string;
  REDIS_URL: string;
  KAFKA_BROKER: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  LOG_LEVEL: string;
  ALLOWED_ORIGINS: string;
}

export const config: Config = {
  SERVICE_NAME: require('../../package.json').name || 'transaction-service',
  PORT: parseInt(process.env.PORT || '5003', 10),
  DATABASE_URL:
    process.env.DATABASE_URL ||
    'postgresql://myuser:mypassword@localhost:5432/privatebank',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  KAFKA_BROKER: process.env.KAFKA_BROKER || 'localhost:9092',
  JWT_SECRET: process.env.GATEWAY_JWT_SECRET || 'secret',
  JWT_EXPIRES_IN: process.env.GATEWAY_JWT_EXPIRES_IN || '1h',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'localhost:5000',
};
