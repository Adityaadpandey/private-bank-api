import { DataSource } from 'typeorm';
import { Credential } from './entity/credential.entity';
import { User } from './entity/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [User, Credential],
});
