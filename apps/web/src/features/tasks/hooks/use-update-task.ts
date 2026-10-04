'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateTask } from '../api/update-task';
import { taskQueryKeys } from '../api/task-query-keys';

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, input }: { taskId: string; input: Parameters<typeof updateTask>[1] }) =>
      updateTask(taskId, input),

    onSuccess: async (task) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: taskQueryKeys.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: taskQueryKeys.detail(task.id),
        }),
      ]);
    },
  });
}
