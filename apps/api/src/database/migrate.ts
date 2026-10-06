import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import pg from 'pg';

const { Client } = pg;

const MIGRATION_LOCK_ID = 947_125_731;

interface MigrationRow {
  version: string;
  checksum: string;
}

async function main(): Promise<void> {
  const client = new Client({
    host: requireEnv('DATABASE_HOST'),
    port: Number(requireEnv('DATABASE_PORT')),
    user: requireEnv('DATABASE_USER'),
    password: requireEnv('DATABASE_PASSWORD'),
    database: requireEnv('DATABASE_NAME'),
  });

  await client.connect();

  try {
    await acquireMigrationLock(client);

    await ensureMigrationTable(client);

    const migrations = await loadMigrations();

    const appliedResult = await client.query<MigrationRow>(`
        SELECT
          version,
          checksum
        FROM schema_migrations
        ORDER BY version
      `);

    const applied = new Map(appliedResult.rows.map((row) => [row.version, row.checksum]));

    for (const migration of migrations) {
      const previousChecksum = applied.get(migration.version);

      if (previousChecksum) {
        if (previousChecksum !== migration.checksum) {
          throw new Error(
            `Migration "${migration.version}" has been modified after it was applied`,
          );
        }

        continue;
      }

      await applyMigration(client, migration);
    }

    console.log('Database migrations completed');
  } finally {
    await client.end();
  }
}

interface Migration {
  version: string;
  sql: string;
  checksum: string;
}

async function loadMigrations(): Promise<Migration[]> {
  const currentFile = fileURLToPath(import.meta.url);

  const migrationsDirectory = join(dirname(currentFile), 'migrations');

  const files = (await readdir(migrationsDirectory)).filter((file) => file.endsWith('.sql')).sort();

  return Promise.all(
    files.map(async (file) => {
      const sql = await readFile(join(migrationsDirectory, file), 'utf8');

      return {
        version: file,
        sql,
        checksum: createHash('sha256').update(sql).digest('hex'),
      };
    }),
  );
}

async function ensureMigrationTable(client: pg.Client): Promise<void> {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(255) PRIMARY KEY,
      checksum VARCHAR(64) NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function acquireMigrationLock(client: pg.Client): Promise<void> {
  await client.query('SELECT pg_advisory_lock($1)', [MIGRATION_LOCK_ID]);
}

async function applyMigration(client: pg.Client, migration: Migration): Promise<void> {
  console.log(`Applying migration: ${migration.version}`);

  await client.query('BEGIN');

  try {
    await client.query(migration.sql);

    await client.query(
      `
        INSERT INTO schema_migrations (
          version,
          checksum
        )
        VALUES ($1, $2)
      `,
      [migration.version, migration.checksum],
    );

    await client.query('COMMIT');

    console.log(`Applied migration: ${migration.version}`);
  } catch (error) {
    await client.query('ROLLBACK');

    throw error;
  }
}

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}
