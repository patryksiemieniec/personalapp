import type { Task } from '../model/task';
import { TaskListItem } from './task-list-item';

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="font-medium text-zinc-800">No tasks yet</p>

        <p className="mt-1 text-sm text-zinc-500">Create your first task above.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-zinc-100">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskListItem task={task} />
        </li>
      ))}
    </ul>
  );
}
