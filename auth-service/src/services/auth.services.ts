import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ms from "ms";
import { Repository } from "typeorm";
import { config } from "../config";
import redis from "../config/redis";
import { AppDataSource } from "../data-source";
import { Credential } from "../entity/credential.entity";
import { User } from "../entity/user.entity";
import { publishUserRegisteredEvent } from "../events/producers/userRegistered.producer";
import { createError } from "../utils";

interface RegisterUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export default class AuthService {
    credentialRepository: Repository<Credential>
    userRepository: Repository<User>

    constructor() {
        this.credentialRepository = AppDataSource.getRepository(Credential);
        this.userRepository = AppDataSource.getRepository(User);
    }

    async register({ firstName, lastName, email, password }: RegisterUser): Promise<User> {
        const existing = await this.credentialRepository.findOneBy({ email });
        if (existing) {
            throw createError('Email already exists', 400);
        }
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User();
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;

        await this.userRepository.save(user);

        const creadential = new Credential();
        creadential.email = email;
        creadential.passwordHash = passwordHash;
        creadential.user = user;

        await this.credentialRepository.save(creadential);

        await publishUserRegisteredEvent({
            key: user.id?.toString(),
            value:user
        })

        return user;
    }

    async login(email: string, password: string) {
        const credential = await this.credentialRepository.findOne({
            where: { email },
            relations: { user: true }
        })

        if (!credential) {
            throw createError('Invalid email or password', 401);
        }

        const isValidPassword = await bcrypt.compare(password, credential.passwordHash);

        if (!isValidPassword) {
            throw createError('Invalid email or password', 401);
        }

        const token = jwt.sign(
            {
                id: credential.user.id,
                email: credential.email,
                firstName: credential.user.firstName,
                lastName: credential.user.lastName
            },
            config.JWT_SECRET,
            {expiresIn: config.JWT_EXPIRES_IN  as ms.StringValue },
        )

        await redis.setex(`auth:${credential.user.id}:${token}`, 24*60*60, 'true');

        return {
            token,
            firstName: credential.user.firstName,
            lastName: credential.user.lastName,
            email: credential.email
        }


    }

    async logout(userId:string,token: string) {
        await redis.del(`auth:${userId}:${token}`);
    }
}
