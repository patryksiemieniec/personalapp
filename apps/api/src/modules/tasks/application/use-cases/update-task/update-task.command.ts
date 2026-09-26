import { TaskPriority } from '../../../domain/task-priority.js';

export interface UpdateTaskCommand {
  title?: string;
  description?: string | null;
  priority?: TaskPriority;
  dueAt?: Date | null;
}
