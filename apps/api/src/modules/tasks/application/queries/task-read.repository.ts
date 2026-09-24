import type { TaskReadModel } from './models/task-read.model.js';

export const TASK_READ_REPOSITORY = Symbol('TASK_READ_REPOSITORY');

export interface TaskReadRepository {
  findById(id: string): Promise<TaskReadModel | null>;

  findMany(): Promise<TaskReadModel[]>;
}
