'use client';

import { Input } from '@/shared/ui/input';
import { Select } from '@/shared/ui/select';

import type { GetTasksParams } from '../api/task-api.types';

interface TaskFiltersProps {
  value: GetTasksParams;
  search: string;
  onSearchChange: (value: string) => void;
  onChange: (value: GetTasksParams) => void;
}

export function TaskFilters({ value, onChange, onSearchChange, search }: TaskFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      <Input
        value={search}
        placeholder="Search tasks..."
        onChange={(event) => onSearchChange(event.target.value)}
      />

      <Select
        value={value.status ?? ''}
        onChange={(event) =>
          onChange({
            ...value,
            status: event.target.value
              ? (event.target.value as GetTasksParams['status'])
              : undefined,
            page: 1,
          })
        }
      >
        <option value="">All statuses</option>

        <option value="todo">Todo</option>

        <option value="in_progress">In progress</option>

        <option value="completed">Completed</option>

        <option value="cancelled">Cancelled</option>
      </Select>

      <Select
        value={value.priority ?? ''}
        onChange={(event) =>
          onChange({
            ...value,
            priority: event.target.value
              ? (event.target.value as GetTasksParams['priority'])
              : undefined,
            page: 1,
          })
        }
      >
        <option value="">All priorities</option>

        <option value="low">Low</option>

        <option value="normal">Normal</option>

        <option value="high">High</option>

        <option value="urgent">Urgent</option>
      </Select>

      <Select
        value={`${value.sort ?? 'createdAt'}:${value.order ?? 'desc'}`}
        onChange={(event) => {
          const [sort, order] = event.target.value.split(':');

          onChange({
            ...value,
            sort: sort as GetTasksParams['sort'],
            order: order as GetTasksParams['order'],
            page: 1,
          });
        }}
      >
        <option value="createdAt:desc">Newest</option>

        <option value="createdAt:asc">Oldest</option>

        <option value="dueAt:asc">Due date</option>

        <option value="priority:desc">Priority</option>
      </Select>
    </div>
  );
}
