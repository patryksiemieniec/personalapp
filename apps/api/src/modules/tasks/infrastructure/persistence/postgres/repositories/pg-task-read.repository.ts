import { Injectable } from '@nestjs/common';
import { TaskStatus } from '../../../../domain/task-status.js';
import { DatabaseService } from '../../../../../../database/database.service.js';
import type { TaskReadRepository } from '../../../../application/queries/task-read.repository.js';
import type { TaskReadModel } from '../../../../application/queries/models/task-read.model.js';
import { TaskPriority } from '../../../../domain/task-priority.js';
import type {
  ListTasksParams,
  PaginatedResult,
} from '../../../../application/queries/models/list-tasks.types.js';

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

  private readonly sortColumns = {
    createdAt: 'created_at',
    dueAt: 'due_at',

    priority: `
    CASE priority
      WHEN 'urgent' THEN 4
      WHEN 'high' THEN 3
      WHEN 'normal' THEN 2
      WHEN 'low' THEN 1
    END
  `,
  } as const;

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
  async findMany(params: ListTasksParams): Promise<PaginatedResult<TaskReadModel>> {
    const sortColumn = this.sortColumns[params.sort];
    const sortOrder = params.order === 'asc' ? 'ASC' : 'DESC';

    const conditions: string[] = [];
    const values: unknown[] = [];

    const addValue = (value: unknown): string => {
      values.push(value);
      return `$${values.length}`;
    };

    if (params.status) {
      const placeholder = addValue(params.status);
      conditions.push(`status = ${placeholder}`);
    }

    if (params.priority) {
      const placeholder = addValue(params.priority);
      conditions.push(`priority = ${placeholder}`);
    }

    if (params.search) {
      const placeholder = addValue(`%${params.search}%`);

      conditions.push(`(title ILIKE ${placeholder} OR description ILIKE ${placeholder})`);
    }

    if (params.dueFrom) {
      const placeholder = addValue(params.dueFrom);
      conditions.push(`due_at >= ${placeholder}`);
    }

    if (params.dueTo) {
      const placeholder = addValue(params.dueTo);
      conditions.push(`due_at <= ${placeholder}`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await this.database.query<{ total: number }>(
      `
        SELECT COUNT(*)::int AS total
        FROM tasks
        ${where}
      `,
      values,
    );

    const total = countResult.rows[0]?.total ?? 0;
    const offset = (params.page - 1) * params.pageSize;
    const limitPlaceholder = addValue(params.pageSize);
    const offsetPlaceholder = addValue(offset);
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
        ${where}
        ORDER BY ${sortColumn} ${sortOrder}, id ASC
        LIMIT ${limitPlaceholder}
        OFFSET ${offsetPlaceholder}
      `,
      values,
    );

    return {
      items: result.rows.map((row) => this.mapRow(row)),
      page: params.page,
      pageSize: params.pageSize,
      total,
    };
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
