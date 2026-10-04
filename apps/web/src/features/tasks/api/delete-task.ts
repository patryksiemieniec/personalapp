import { httpClient } from '@/shared/api/http-client';

export function deleteTask(taskId: string): Promise<void> {
  return httpClient<void>(`/tasks/${taskId}`, {
    method: 'DELETE',
  });
}
