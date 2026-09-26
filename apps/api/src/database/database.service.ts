import { Injectable, Logger, type OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, type QueryResult, type QueryResultRow } from 'pg';

@Injectable()
export class DatabaseService implements OnApplicationShutdown {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly pool: Pool;

  constructor(private readonly configService: ConfigService) {
    this.pool = new Pool({
      host: this.configService.getOrThrow<string>('DATABASE_HOST'),
      port: this.configService.getOrThrow<number>('DATABASE_PORT'),
      user: this.configService.getOrThrow<string>('DATABASE_USER'),
      password: this.configService.getOrThrow<string>('DATABASE_PASSWORD'),
      database: this.configService.getOrThrow<string>('DATABASE_NAME'),
    });
  }

  query<T extends QueryResultRow>(text: string, params?: unknown[]): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, params);
  }

  async onApplicationShutdown(): Promise<void> {
    this.logger.log('Closing PostgreSQL connection pool');

    await this.pool.end();
  }
}
