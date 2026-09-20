import { Controller, Get, Inject } from '@nestjs/common';
import { DATABASE_POOL } from './database/database.constant.js';
import { Pool } from 'pg';

@Controller()
export class AppController {
  constructor(
    @Inject(DATABASE_POOL)
    private readonly db: Pool,
  ) {}

  @Get('health')
  async health() {
    const result = await this.db.query('SELECT NOW() AS now');

    return {
      status: 'ok',
      database: 'ok',
      time: result.rows[0].now,
    };
  }
}
