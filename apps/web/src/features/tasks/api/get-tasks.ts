import { httpClient } from '@/shared/api/http-client';

import type { GetTasksParams, PaginatedTasksResponse } from './task-api.types';

export async function getTasks(params: GetTasksParams = {}): Promise<PaginatedTasksResponse> {
  const searchParams = new URLSearchParams();

  if (params.status) {
    searchParams.set('status', params.status);
  }

  if (params.priority) {
    searchParams.set('priority', params.priority);
  }

  if (params.search) {
    searchParams.set('search', params.search);
  }

  if (params.page) {
    searchParams.set('page', String(params.page));
  }

  if (params.pageSize) {
    searchParams.set('pageSize', String(params.pageSize));
  }

  if (params.sort) {
    searchParams.set('sort', params.sort);
  }

  if (params.order) {
    searchParams.set('order', params.order);
  }

  const query = searchParams.toString();

  return httpClient(`/tasks${query ? `?${query}` : ''}`);
}
