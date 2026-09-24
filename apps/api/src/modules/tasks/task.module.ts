import { Module } from '@nestjs/common';

import { CLOCK } from './application/ports/clock.js';

import { ID_GENERATOR } from './application/ports/id-generator.js';

import { PgTaskRepository } from './infrastructure/persistence/postgres/repositories/pg-task.repository.js';
import { SystemClock } from './infrastructure/time/system-clock.js';
import { UuidGenerator } from './infrastructure/id/uuid-generator.js';

import { CreateTaskUseCase } from './application/use-cases/create-task.use-case.js';
import { StartTaskUseCase } from './application/use-cases/start-task.use-case.js';
import { CompleteTaskUseCase } from './application/use-cases/complete-task.use-case.js';
import { CancelTaskUseCase } from './application/use-cases/cancel-task.use-case.js';
import { ReopenTaskUseCase } from './application/use-cases/reopen-task.use-case.js';
import { TASK_REPOSITORY } from './domain/task.repository.js';
import { TasksController } from './presentation/task.controller.js';
import { TASK_READ_REPOSITORY } from './application/queries/task-read.repository.js';
import { PgTaskReadRepository } from './infrastructure/persistence/postgres/repositories/pg-task-read.repository.js';
import { GetTaskQuery } from './application/queries/get-task.query.js';
import { ListTasksQuery } from './application/queries/list-tasks.query.js';

@Module({
  controllers: [TasksController],
  providers: [
    PgTaskRepository,
    SystemClock,
    UuidGenerator,

    {
      provide: TASK_REPOSITORY,
      useExisting: PgTaskRepository,
    },
    {
      provide: CLOCK,
      useExisting: SystemClock,
    },
    {
      provide: ID_GENERATOR,
      useExisting: UuidGenerator,
    },
    {
      provide: TASK_READ_REPOSITORY,
      useExisting: PgTaskReadRepository,
    },
    CreateTaskUseCase,
    StartTaskUseCase,
    CompleteTaskUseCase,
    CancelTaskUseCase,
    ReopenTaskUseCase,
    GetTaskQuery,
    ListTasksQuery,
  ],
})
export class TasksModule {}
