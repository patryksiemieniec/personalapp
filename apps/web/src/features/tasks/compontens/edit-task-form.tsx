'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/ui/button';
import { Field } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Select } from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';

import type { Task } from '../model/task';
import { useUpdateTask } from '../hooks/use-update-task';
import { editTaskSchema, type EditTaskFormValues } from '../schemas/edit-task.schema';

interface EditTaskFormProps {
  task: Task;
  onCancel: () => void;
  onSaved: () => void;
}

export function EditTaskForm({ task, onCancel, onSaved }: EditTaskFormProps) {
  const updateTask = useUpdateTask();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditTaskFormValues>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description ?? '',
      priority: task.priority,
      dueAt: task.dueAt ? toDateTimeLocal(task.dueAt) : '',
    },
  });

  async function onSubmit(values: EditTaskFormValues) {
    await updateTask.mutateAsync({
      taskId: task.id,
      input: {
        title: values.title,
        description: values.description || null,
        priority: values.priority,
        dueAt: values.dueAt ? new Date(values.dueAt).toISOString() : null,
      },
    });

    onSaved();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 border-t border-zinc-100 bg-zinc-50 px-5 py-4"
    >
      <Field label="Title" error={errors.title?.message}>
        <Input {...register('title')} />
      </Field>

      <Field label="Description" error={errors.description?.message}>
        <Textarea {...register('description')} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Priority" error={errors.priority?.message}>
          <Select {...register('priority')}>
            <option value="low">Low</option>

            <option value="normal">Normal</option>

            <option value="high">High</option>

            <option value="urgent">Urgent</option>
          </Select>
        </Field>

        <Field label="Due date" error={errors.dueAt?.message}>
          <Input type="datetime-local" {...register('dueAt')} />
        </Field>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting || updateTask.isPending}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting || updateTask.isPending}>
          {updateTask.isPending ? 'Saving...' : 'Save changes'}
        </Button>
      </div>

      {updateTask.isError && <p className="text-sm text-red-600">Could not update task.</p>}
    </form>
  );
}

function toDateTimeLocal(value: string): string {
  const date = new Date(value);

  const pad = (number: number) => String(number).padStart(2, '0');

  return [
    date.getFullYear(),
    '-',
    pad(date.getMonth() + 1),
    '-',
    pad(date.getDate()),
    'T',
    pad(date.getHours()),
    ':',
    pad(date.getMinutes()),
  ].join('');
}
