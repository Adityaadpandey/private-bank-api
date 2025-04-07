interface Config {
  SERVICE_NAME: string;
  PORT: number;
  DEFAULT_TIMEOUT: number;
  AUTH_JWT_SECRET: string;
  GATEWAY_JWT_SECRET: string;
  GATEWAY_JWT_EXPIRES_IN: string;
  LOG_LEVEL: string;
  REDIS_URL: string;
  AUTH_SERVICE_URL: string;
  ACCOUNTS_SERVICE_URL: string;
  TRANSACTIONS_SERVICE_URL: string;
}

export const config: Config = {
  SERVICE_NAME: require('../../package.json').name || 'api-gateway',
  PORT: parseInt(process.env.PORT || '3000', 10),
  DEFAULT_TIMEOUT: parseInt(process.env.DEFAULT_TIMEOUT || '5000', 10),
  AUTH_JWT_SECRET: process.env.AUTH_JWT_SECRET || 'secret',
  GATEWAY_JWT_SECRET: process.env.GATEWAY_JWT_SECRET || 'secret',
  GATEWAY_JWT_EXPIRES_IN: process.env.GATEWAY_JWT_EXPIRES_IN || '1h',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  ACCOUNTS_SERVICE_URL:
    process.env.ACCOUNTS_SERVICE_URL || 'http://localhost:3002',
  TRANSACTIONS_SERVICE_URL:
    process.env.TRANSACTIONS_SERVICE_URL || 'http://localhost:3003',
};
