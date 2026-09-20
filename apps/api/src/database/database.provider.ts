import { Pool } from 'pg';
import { DATABASE_POOL } from './database.constant.js';

export const databaseProvider = {
  provide: DATABASE_POOL,

  useFactory: () => {
    return new Pool({
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    });
  },
};
