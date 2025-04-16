import { Router } from 'express';

const indexRoute = Router();

indexRoute.get('/', (req, res) => {
  res.send('Auth service is running');
});

indexRoute.get('/health', (req, res) => {
  res.send('Auth service is healthy');
});

export default indexRoute;
