import { Router } from 'express';

const indexRoutes = Router();

indexRoutes.get('/', (req, res) => {
  res.status(200).json({ message: 'Transaction service is running' });
});
indexRoutes.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default indexRoutes;
