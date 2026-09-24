import { Injectable } from '@nestjs/common';
import { TaskStatus } from '../../../../domain/task-status.js';
import { DatabaseService } from '../../../../../../database/database.service.js';
import { TaskReadRepository } from '../../../../application/queries/task-read.repository.js';
import { TaskReadModel } from '../../../../application/queries/models/task-read.model.js';
import { TaskPriority } from '../../../../domain/task-priority.js';

interface TaskReadRow {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_at: Date | null;
  completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class PgTaskReadRepository implements TaskReadRepository {
  constructor(private readonly database: DatabaseService) {}

  async findById(id: string): Promise<TaskReadModel | null> {
    const result = await this.database.query<TaskReadRow>(
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

    if (!row) {
      return null;
    }

    return this.mapRow(row);
  }

  async findMany(): Promise<TaskReadModel[]> {
    const result = await this.database.query<TaskReadRow>(
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
          ORDER BY created_at DESC
        `,
    );

    return result.rows.map((row) => this.mapRow(row));
  }

  private mapRow(row: TaskReadRow): TaskReadModel {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      priority: row.priority,
      dueAt: row.due_at,
      completedAt: row.completed_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
