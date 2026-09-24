import { TaskPriority } from '../../../domain/task-priority.js';
import { TaskStatus } from '../../../domain/task-status.js';

export interface TaskReadModel {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
