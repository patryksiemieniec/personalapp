import { Inject, Injectable } from '@nestjs/common';

import { TASK_READ_REPOSITORY, type TaskReadRepository } from './task-read.repository.js';
import type { ListTasksParams } from './models/list-tasks.types.js';

@Injectable()
export class ListTasksQuery {
  constructor(
    @Inject(TASK_READ_REPOSITORY)
    private readonly repository: TaskReadRepository,
  ) {}

  execute(params: ListTasksParams) {
    return this.repository.findMany(params);
  }
}
