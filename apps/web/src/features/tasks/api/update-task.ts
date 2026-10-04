import { httpClient } from '@/shared/api/http-client';

import type { Task, TaskPriority } from '../model/task';

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  priority?: TaskPriority;
  dueAt?: string | null;
}

export function updateTask(taskId: string, input: UpdateTaskInput): Promise<Task> {
  return httpClient<Task>(`/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}
