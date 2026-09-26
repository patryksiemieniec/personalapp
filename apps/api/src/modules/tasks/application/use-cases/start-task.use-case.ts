import { Inject, Injectable } from '@nestjs/common';
import { TASK_REPOSITORY, type TaskRepository } from '../../domain/task.repository.js';
import { TaskNotFoundError } from '../errors/task-not-found.error.js';
import { CLOCK, type Clock } from '../ports/clock.js';
import { mapTaskDomainError } from '../errors/map-task-domain-error.js';

@Injectable()
export class StartTaskUseCase {
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

    try {
      task.start(this.clock.now());
    } catch (error) {
      mapTaskDomainError(error);
    }

    await this.taskRepository.save(task);
  }
}
