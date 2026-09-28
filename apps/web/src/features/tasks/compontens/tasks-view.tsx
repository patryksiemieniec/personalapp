'use client';

import { useQuery } from '@tanstack/react-query';

import { getTasks } from '../api/get-tasks';
import { taskQueryKeys } from '../api/task-query-keys';
import { CreateTaskForm } from './create-task-form';
import { TaskList } from './task-list';

export function TasksView() {
  const filters = {
    page: 1,
    pageSize: 20,
    sort: 'createdAt' as const,
    order: 'desc' as const,
  };

  const tasksQuery = useQuery({
    queryKey: taskQueryKeys.list(filters),
    queryFn: () => getTasks(filters),
  });

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="mb-1 text-sm font-medium text-zinc-500">Personal Ops</p>

        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Tasks</h1>

        <p className="mt-2 text-sm text-zinc-500">
          Keep track of everything that needs your attention.
        </p>
      </header>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-zinc-900">New task</h2>

          <p className="mt-1 text-sm text-zinc-500">Add something you want to take care of.</p>
        </div>

        <CreateTaskForm />
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Your tasks</h2>

            <p className="mt-1 text-sm text-zinc-500">{tasksQuery.data?.total ?? 0} tasks</p>
          </div>
        </div>

        {tasksQuery.isLoading && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500">
            Loading tasks...
          </div>
        )}

        {tasksQuery.isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Failed to load tasks.
          </div>
        )}

        {tasksQuery.data && (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            {tasksQuery.data.items.length === 0 ? (
              <div className="p-8 text-center">
                <p className="font-medium text-zinc-800">No tasks yet</p>

                <p className="mt-1 text-sm text-zinc-500">Create your first task above.</p>
              </div>
            ) : (
              <TaskList tasks={tasksQuery.data.items} />
            )}
          </div>
        )}
      </section>
    </main>
  );
}
