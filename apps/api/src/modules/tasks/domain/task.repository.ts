import type { Task } from './task.js';

export const TASK_REPOSITORY = Symbol('TASK_REPOSITORY');

export interface TaskRepository {
  save(task: Task): Promise<void>;

  findById(id: string): Promise<Task | null>;

  delete(id: string): Promise<void>;
}
