'use client';

import { Button } from '@/shared/ui/button';

import type { Task } from '../model/task';
import { useDeleteTask } from '../hooks/use-delete-task';

interface DeleteTaskConfirmationProps {
  task: Task;
  onCancel: () => void;
}

export function DeleteTaskConfirmation({ task, onCancel }: DeleteTaskConfirmationProps) {
  const deleteTask = useDeleteTask();

  async function handleDelete() {
    await deleteTask.mutateAsync(task.id);
  }

  return (
    <div className="border-t border-red-100 bg-red-50 px-5 py-4">
      <p className="font-medium text-red-900">Delete this task?</p>

      <p className="mt-1 text-sm text-red-700">This action cannot be undone.</p>

      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={deleteTask.isPending}>
          Cancel
        </Button>

        <Button variant="danger" onClick={handleDelete} disabled={deleteTask.isPending}>
          {deleteTask.isPending ? 'Deleting...' : 'Delete'}
        </Button>
      </div>

      {deleteTask.isError && <p className="mt-3 text-sm text-red-700">Could not delete task.</p>}
    </div>
  );
}
