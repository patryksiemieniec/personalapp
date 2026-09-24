import { Task } from '../../../domain/task.js';
import { TaskPriority } from '../../../domain/task-priority.js';
import { TaskStatus } from '../../../domain/task-status.js';
import type { TaskRow } from './task-row.js';

export class TaskMapper {
  static toDomain(row: TaskRow): Task {
    return Task.restore({
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status as TaskStatus,
      priority: row.priority as TaskPriority,
      dueAt: row.due_at,
      completedAt: row.completed_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}
