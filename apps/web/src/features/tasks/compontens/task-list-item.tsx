'use client';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';

import type { Task } from '../model/task';
import { useTaskAction } from '../hooks/use-task-action';

interface TaskListItemProps {
  task: Task;
}

export function TaskListItem({ task }: TaskListItemProps) {
  const taskAction = useTaskAction();

  const isPending = taskAction.isPending;

  const statusVariant = {
    todo: 'default',
    in_progress: 'warning',
    completed: 'success',
    cancelled: 'muted',
  } as const;

  const priorityVariant = {
    low: 'muted',
    normal: 'default',
    high: 'warning',
    urgent: 'danger',
  } as const;

  async function runAction(action: 'start' | 'complete' | 'cancel' | 'reopen') {
    await taskAction.mutateAsync({
      taskId: task.id,
      action,
    });
  }

  return (
    <article className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-medium text-zinc-900">{task.title}</h3>

          <Badge variant={statusVariant[task.status]}>{task.status}</Badge>

          <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
        </div>

        {task.description && (
          <p className="mt-2 line-clamp-2 text-sm text-zinc-500">{task.description}</p>
        )}

        {task.dueAt && (
          <p className="mt-2 text-xs text-zinc-400">Due: {new Date(task.dueAt).toLocaleString()}</p>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        {task.status === 'todo' && (
          <>
            <Button variant="secondary" disabled={isPending} onClick={() => runAction('start')}>
              Start
            </Button>

            <Button disabled={isPending} onClick={() => runAction('complete')}>
              Complete
            </Button>

            <Button variant="ghost" disabled={isPending} onClick={() => runAction('cancel')}>
              Cancel
            </Button>
          </>
        )}

        {task.status === 'in_progress' && (
          <>
            <Button disabled={isPending} onClick={() => runAction('complete')}>
              Complete
            </Button>

            <Button variant="ghost" disabled={isPending} onClick={() => runAction('cancel')}>
              Cancel
            </Button>
          </>
        )}

        {(task.status === 'completed' || task.status === 'cancelled') && (
          <Button variant="secondary" disabled={isPending} onClick={() => runAction('reopen')}>
            Reopen
          </Button>
        )}
      </div>
    </article>
  );
}
