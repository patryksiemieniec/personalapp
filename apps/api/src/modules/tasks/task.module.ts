import { Module } from '@nestjs/common';

import { CLOCK } from './application/ports/clock.js';

import { ID_GENERATOR } from './application/ports/id-generator.js';

import { PgTaskRepository } from './infrastructure/persistence/postgres/repositories/pg-task.repository.js';
import { SystemClock } from './infrastructure/time/system-clock.js';
import { UuidGenerator } from './infrastructure/id/uuid-generator.js';

import { CreateTaskUseCase } from './application/use-cases/create-task/create-task.use-case.js';
import { StartTaskUseCase } from './application/use-cases/start-task/start-task.use-case.js';
import { CompleteTaskUseCase } from './application/use-cases/complete-task/complete-task.use-case.js';
import { CancelTaskUseCase } from './application/use-cases/cancel-task/cancel-task.use-case.js';
import { ReopenTaskUseCase } from './application/use-cases/reopen-task/reopen-task.use-case.js';
import { TASK_REPOSITORY } from './domain/task.repository.js';
import { TasksController } from './presentation/task.controller.js';
import { TASK_READ_REPOSITORY } from './application/queries/task-read.repository.js';
import { PgTaskReadRepository } from './infrastructure/persistence/postgres/repositories/pg-task-read.repository.js';
import { GetTaskQuery } from './application/queries/get-task.query.js';
import { ListTasksQuery } from './application/queries/list-tasks.query.js';
import { UpdateTaskUseCase } from './application/use-cases/update-task/update-task.use-case.js';
import { DeleteTaskUseCase } from './application/use-cases/delete-task/delete-task.use-case.js';

@Module({
  controllers: [TasksController],
  providers: [
    PgTaskRepository,
    PgTaskReadRepository,
    SystemClock,
    UuidGenerator,

    {
      provide: TASK_REPOSITORY,
      useExisting: PgTaskRepository,
    },
    {
      provide: TASK_READ_REPOSITORY,
      useExisting: PgTaskReadRepository,
    },
    {
      provide: CLOCK,
      useExisting: SystemClock,
    },
    {
      provide: ID_GENERATOR,
      useExisting: UuidGenerator,
    },

    CreateTaskUseCase,
    StartTaskUseCase,
    CompleteTaskUseCase,
    CancelTaskUseCase,
    ReopenTaskUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    GetTaskQuery,
    ListTasksQuery,
  ],
})
export class TasksModule {}
