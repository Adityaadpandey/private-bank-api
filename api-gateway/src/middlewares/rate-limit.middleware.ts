import reateLimit from 'express-rate-limit';
import { config } from '../config';

export const limiter = reateLimit({
  skip: (req, res) => {
    return config.NODE_ENV != 'production'
  },
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
