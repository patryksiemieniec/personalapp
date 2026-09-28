import { httpClient } from '@/shared/api/http-client';

import type { Task } from '../model/task';

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  dueAt?: string | null;
}

export function createTask(input: CreateTaskInput): Promise<Task> {
  return httpClient<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
