'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { changeTaskStatus, type TaskAction } from '../api/change-task-status';

import { taskQueryKeys } from '../api/task-query-keys';

interface TaskActionInput {
  taskId: string;
  action: TaskAction;
}

export function useTaskAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, action }: TaskActionInput) => changeTaskStatus(taskId, action),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: taskQueryKeys.lists(),
        }),

        queryClient.invalidateQueries({
          queryKey: taskQueryKeys.detail(variables.taskId),
        }),
      ]);
    },
  });
}
