import { Request, Response, Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/register', authController.register.bind(authController));
authRouter.post('/login', authController.login.bind(authController));
authRouter.post('/logout', authController.logout.bind(authController));

authRouter.get('/', (req: Request, res: Response): any => {
  return res.status(200).json({ message: 'Auth service is running' });
});

export { authRouter };
