import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../../../../../database/database.service.js';
import type { Task } from '../../../domain/task.js';
import { TaskMapper } from './task.mapper.js';
import type { TaskRow } from './task-row.js';
import { TaskRepository } from '../../../domain/task.repository.js';

@Injectable()
export class PgTaskRepository implements TaskRepository {
  constructor(private readonly database: DatabaseService) {}

  async save(task: Task): Promise<void> {
    await this.database.query(
      `
        INSERT INTO tasks (
          id,
          title,
          description,
          status,
          priority,
          due_at,
          completed_at,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id)
        DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          status = EXCLUDED.status,
          priority = EXCLUDED.priority,
          due_at = EXCLUDED.due_at,
          completed_at = EXCLUDED.completed_at,
          updated_at = EXCLUDED.updated_at
      `,
      [
        task.id,
        task.title,
        task.description,
        task.status,
        task.priority,
        task.dueAt,
        task.completedAt,
        task.createdAt,
        task.updatedAt,
      ],
    );
  }

  async findById(id: string): Promise<Task | null> {
    const result = await this.database.query<TaskRow>(
      `
        SELECT
          id,
          title,
          description,
          status,
          priority,
          due_at,
          completed_at,
          created_at,
          updated_at
        FROM tasks
        WHERE id = $1
      `,
      [id],
    );

    const row = result.rows[0];

    return row ? TaskMapper.toDomain(row) : null;
  }

  async delete(id: string): Promise<void> {
    await this.database.query(
      `
        DELETE FROM tasks
        WHERE id = $1
      `,
      [id],
    );
  }
}
