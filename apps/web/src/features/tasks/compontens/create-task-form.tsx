'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/ui/button';
import { Field } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Select } from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';

import { useCreateTask } from '../hooks/use-create-task';
import { createTaskSchema, type CreateTaskFormValues } from '../schemas/create-task.schema';

export function CreateTaskForm() {
  const createTask = useCreateTask();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'normal',
      dueAt: '',
    },
  });

  async function onSubmit(values: CreateTaskFormValues) {
    await createTask.mutateAsync({
      title: values.title,
      description: values.description || null,
      priority: values.priority,
      dueAt: values.dueAt ? new Date(values.dueAt).toISOString() : null,
    });

    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Field label="Title" error={errors.title?.message}>
        <Input {...register('title')} placeholder="What needs to be done?" />
      </Field>

      <Field label="Description" error={errors.description?.message}>
        <Textarea {...register('description')} placeholder="Add some details..." />
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

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || createTask.isPending}>
          {createTask.isPending ? 'Creating...' : 'Create task'}
        </Button>
      </div>

      {createTask.isError && <p className="text-sm text-red-600">Could not create task.</p>}
    </form>
  );
}
