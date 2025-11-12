import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Link } from '../links/entities/link.entity';
import { Click } from '../links/entities/click.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER, 
  password: process.env.DB_PASS,
  database: process.env.DB_NAME, 
  synchronize: false,
  logging: false,
  entities: [User, Link, Click],
  migrations: ['src/migrations/*.ts'],
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});
