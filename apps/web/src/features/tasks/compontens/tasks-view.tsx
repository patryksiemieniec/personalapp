'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/shared/ui/button';
import { getTasks } from '../api/get-tasks';
import { taskQueryKeys } from '../api/task-query-keys';
import type { GetTasksParams } from '../api/task-api.types';
import { CreateTaskForm } from './create-task-form';
import { TaskFilters } from './task-filters';
import { TaskList } from './task-list';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';
import { getPage } from '../lib/task-search-param';

export function TasksView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const debouncedSearch = useDebouncedValue(search, 350);
  const filters = useMemo<GetTasksParams>(
    () => ({
      page: getPage(searchParams.get('page')),
      pageSize: 10,
      status: (searchParams.get('status') as GetTasksParams['status']) ?? undefined,
      priority: (searchParams.get('priority') as GetTasksParams['priority']) ?? undefined,
      search: debouncedSearch || undefined,
      sort: (searchParams.get('sort') as GetTasksParams['sort']) ?? 'createdAt',
      order: (searchParams.get('order') as GetTasksParams['order']) ?? 'desc',
    }),
    [searchParams, debouncedSearch],
  );

  const updateParams = useCallback(
    (values: Record<string, string | undefined>) => {
      const current = searchParams.toString();
      const params = new URLSearchParams(current);

      for (const [key, value] of Object.entries(values)) {
        if (!value) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      const next = params.toString();

      if (next === current) {
        return;
      }

      router.replace(next ? `${pathname}?${next}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );
  const tasksQuery = useQuery({
    queryKey: taskQueryKeys.list(filters),
    queryFn: () => getTasks(filters),
  });
  const data = tasksQuery.data;
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 10;
  const totalPages = data ? Math.max(1, Math.ceil(data.total / pageSize)) : 1;

  useEffect(() => {
    const urlSearch = searchParams.get('search') ?? '';

    if (debouncedSearch === urlSearch) {
      return;
    }

    updateParams({
      search: debouncedSearch || undefined,
      page: '1',
    });
  }, [debouncedSearch, searchParams, updateParams]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="mb-1 text-sm font-medium text-zinc-500">Personal Ops</p>

        <h1 className="text-3xl font-semibold tracking-tight">Tasks</h1>

        <p className="mt-2 text-sm text-zinc-500">
          Keep track of everything that needs your attention.
        </p>
      </header>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">New task</h2>
        </div>

        <CreateTaskForm />
      </section>

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Your tasks</h2>

          <p className="mt-1 text-sm text-zinc-500">{data?.total ?? 0} tasks</p>
        </div>

        <div className="mb-4 rounded-2xl border border-zinc-200 bg-white p-4">
          <TaskFilters
            value={filters}
            search={search}
            onSearchChange={setSearch}
            onChange={(next) => {
              updateParams({
                status: next.status,
                priority: next.priority,
                sort: next.sort,
                order: next.order,
                page: String(next.page ?? 1),
              });
            }}
          />
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

        {data && (
          <>
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
              <TaskList tasks={data.items} />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-zinc-500">
                Page {page} of {totalPages}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  disabled={page <= 1 || tasksQuery.isFetching}
                  onClick={() =>
                    updateParams({
                      page: String(Math.max(1, page - 1)),
                    })
                  }
                >
                  Previous
                </Button>

                <Button
                  variant="secondary"
                  disabled={page >= totalPages || tasksQuery.isFetching}
                  onClick={() =>
                    updateParams({
                      page: String(page + 1),
                    })
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
