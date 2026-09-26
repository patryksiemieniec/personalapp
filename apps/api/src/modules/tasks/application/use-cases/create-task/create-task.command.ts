import type { TaskPriority } from '../../../domain/task-priority.js';

export interface CreateTaskCommand {
  title: string;
  description?: string | null;
  priority?: TaskPriority;
  dueAt?: Date | null;
}
