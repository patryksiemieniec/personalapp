import { TaskPriority } from '../../../domain/task-priority.js';
import { TaskStatus } from '../../../domain/task-status.js';

export type TaskSortField = 'createdAt' | 'dueAt' | 'priority';

export type SortOrder = 'asc' | 'desc';

export interface ListTasksParams {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;

  dueFrom?: Date;
  dueTo?: Date;

  sort: TaskSortField;
  order: SortOrder;

  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}
