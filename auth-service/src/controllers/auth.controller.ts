import { Request, Response } from 'express';
import { z } from 'zod';
import AuthService from '../services/auth.services';

const registerSchema = z.object({
    firstName: z.string().min(3).max(50),
    lastName: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(6).max(100),
})

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})

class AuthController{
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }


    register = async (req: Request, res: Response): Promise<any> => {
        const { firstName, lastName, email, password } = registerSchema.parse(req.body);
        const user = await this.authService.register({ firstName, lastName, email, password });
        return res.status(201).json({ user });
    };



    login = async (req: Request, res: Response): Promise<any> => {
        const { email, password } = loginSchema.parse(req.body);
        const token = await this.authService.login(email, password);

        return res.status(200).json({token});
    }


    logout = async (req: Request, res: Response): Promise<any> => {
        await this.authService.logout(req.userId!, req.token);
        return res.status(200).json({message: 'Logged out successfully'});
    }
}


export { AuthController };
