import { Inject, Injectable } from '@nestjs/common';

import { TASK_READ_REPOSITORY, type TaskReadRepository } from './task-read.repository.js';

@Injectable()
export class ListTasksQuery {
  constructor(
    @Inject(TASK_READ_REPOSITORY)
    private readonly repository: TaskReadRepository,
  ) {}

  execute() {
    return this.repository.findMany();
  }
}
