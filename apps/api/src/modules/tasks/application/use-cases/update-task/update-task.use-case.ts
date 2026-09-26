import { Inject, Injectable } from '@nestjs/common';
import { TASK_REPOSITORY, type TaskRepository } from '../../../domain/task.repository.js';
import { mapTaskDomainError } from '../../errors/map-task-domain-error.js';
import { TaskNotFoundError } from '../../errors/task-not-found.error.js';
import { CLOCK, type Clock } from '../../ports/clock.js';
import type { Task } from '../../../domain/task.js';
import type { UpdateTaskCommand } from './update-task.command.js';

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,

    @Inject(CLOCK)
    private readonly clock: Clock,
  ) {}

  async execute(taskId: string, command: UpdateTaskCommand): Promise<Task> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new TaskNotFoundError(taskId);
    }

    const now = this.clock.now();

    try {
      if (command.title !== undefined) {
        task.rename(command.title, now);
      }

      if (command.description !== undefined) {
        task.changeDescription(command.description, now);
      }

      if (command.priority !== undefined) {
        task.changePriority(command.priority, now);
      }

      if (command.dueAt !== undefined) {
        task.reschedule(command.dueAt, now);
      }
    } catch (error) {
      mapTaskDomainError(error);
    }

    await this.taskRepository.save(task);

    return task;
  }
}
