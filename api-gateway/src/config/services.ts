import { Application } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { config } from '.';
import { ProxyErrorResponse, ServiceConfig } from '../types';
import logger from './logger';

class ServiceProxy {
  private static readonly serviceConfigs: ServiceConfig[] = [
    {
      path: '/api/v1/auth/',
      url: config.AUTH_SERVICE_URL,
      pathRewrite: { '^/': '/api/v1/auth/' },
      name: 'auth-service',
      timeout: 5000,
    },
    {
      path: '/api/v1/accounts/',
      url: config.ACCOUNTS_SERVICE_URL,
      pathRewrite: { '^/': '/api/v1/accounts/' },
      name: 'accounts-service',
      timeout: 5000,
    },
    {
      path: '/api/v1/transactions/',
      url: config.TRANSACTIONS_SERVICE_URL,
      pathRewrite: { '^/': '/api/v1/transactions/' },
      name: 'transactions-service',
      timeout: 5000,
    },
  ];

  public static createProxyOptions(service: ServiceConfig): Options {
    return {
      target: service.url,
      changeOrigin: true,
      pathRewrite: service.pathRewrite,
      timeout: service.timeout || config.DEFAULT_TIMEOUT,
      logger: logger,
      on: {
        error: ServiceProxy.handleProxyError,
        proxyReq: ServiceProxy.handleProxyRequest,
        proxyRes: ServiceProxy.handleProxyResponse,
      },
    };
  }

  private static handleProxyError(err: Error, req: any, res: any) {
    logger.error(`Proxy error: ${err.message}`);
    const errorResponse: ProxyErrorResponse = {
      message: 'Service unavailable',
      status: 503,
      timestamp: new Date().toISOString(),
    };
    res
      .status(503)
      .setHeader('Content-Type', 'application/json')
      .end(JSON.stringify(errorResponse));
  }

  private static handleProxyRequest(proxyReq: any, req: any, res: any) {
    logger.debug(`Proxy request: ${req.method} ${req.url}`);
  }

  private static handleProxyResponse(proxyRes: any, req: any, res: any) {
    logger.debug(
      `Proxy response: ${proxyRes.statusCode} ${req.method} ${req.url}`,
    );
  }

  public static setupProxy(app: Application) {
    ServiceProxy.serviceConfigs.forEach((service) => {
      const proxyOptions = ServiceProxy.createProxyOptions(service);
      app.use(service.path, createProxyMiddleware(proxyOptions));
      logger.info(
        `Proxying ${service.name} requests from ${service.path} to ${service.url}`,
      );
    });
  }
}

export const proxyServices = (app: Application): void => {
  ServiceProxy.setupProxy(app);
};
