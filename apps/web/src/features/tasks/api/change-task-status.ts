import { httpClient } from '@/shared/api/http-client';

export type TaskAction = 'start' | 'complete' | 'cancel' | 'reopen';

export function changeTaskStatus(taskId: string, action: TaskAction): Promise<void> {
  return httpClient<void>(`/tasks/${taskId}/${action}`, {
    method: 'POST',
  });
}
