'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteTask } from '../api/delete-task';
import { taskQueryKeys } from '../api/task-query-keys';

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,

    onSuccess: async (_, taskId) => {
      queryClient.removeQueries({
        queryKey: taskQueryKeys.detail(taskId),
      });

      await queryClient.invalidateQueries({
        queryKey: taskQueryKeys.lists(),
      });
    },
  });
}
