import { Inject, Injectable } from '@nestjs/common';

import { TASK_READ_REPOSITORY, type TaskReadRepository } from './task-read.repository.js';

import { TaskNotFoundError } from '../errors/task-not-found.error.js';

@Injectable()
export class GetTaskQuery {
  constructor(
    @Inject(TASK_READ_REPOSITORY)
    private readonly repository: TaskReadRepository,
  ) {}

  async execute(id: string) {
    const task = await this.repository.findById(id);

    if (!task) {
      throw new TaskNotFoundError(id);
    }

    return task;
  }
}
