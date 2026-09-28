import type { Task } from '../model/task';

export interface PaginatedTasksResponse {
  items: Task[];
  page: number;
  pageSize: number;
  total: number;
}

export interface GetTasksParams {
  status?: string;
  priority?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: 'createdAt' | 'dueAt' | 'priority';
  order?: 'asc' | 'desc';
}
