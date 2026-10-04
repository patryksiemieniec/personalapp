import type { Task, TaskPriority, TaskStatus } from '../model/task';

export type TaskSort = 'createdAt' | 'dueAt' | 'priority';

export type SortOrder = 'asc' | 'desc';

export interface GetTasksParams {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;

  page?: number;
  pageSize?: number;

  sort?: TaskSort;
  order?: SortOrder;
}

export interface PaginatedTasksResponse {
  items: Task[];
  page: number;
  pageSize: number;
  total: number;
}
