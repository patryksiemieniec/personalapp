import { Inject, Injectable } from '@nestjs/common';
import { TASK_REPOSITORY, type TaskRepository } from '../../domain/task.repository.js';
import { TaskNotFoundError } from '../errors/task-not-found.error.js';
import { CLOCK, type Clock } from '../ports/clock.js';

@Injectable()
export class CancelTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,

    @Inject(CLOCK)
    private readonly clock: Clock,
  ) {}

  async execute(taskId: string): Promise<void> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new TaskNotFoundError(taskId);
    }

    task.cancel(this.clock.now());

    await this.taskRepository.save(task);
  }
}
