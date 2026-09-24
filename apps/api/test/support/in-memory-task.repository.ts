import { TaskRepository } from '../../src/modules/tasks/domain/task.repository.js';
import type { Task } from '../../src/modules/tasks/domain/task.js';

export class InMemoryTaskRepository implements TaskRepository {
  readonly items = new Map<string, Task>();

  async save(task: Task): Promise<void> {
    this.items.set(task.id, task);
  }

  async findById(id: string): Promise<Task | null> {
    return this.items.get(id) ?? null;
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }
}
