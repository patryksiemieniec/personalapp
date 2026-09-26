import { Inject, Injectable } from '@nestjs/common';
import { TASK_REPOSITORY, type TaskRepository } from '../../../domain/task.repository.js';
import { TaskNotFoundError } from '../../errors/task-not-found.error.js';

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(taskId: string): Promise<void> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new TaskNotFoundError(taskId);
    }

    await this.taskRepository.delete(taskId);
  }
}
