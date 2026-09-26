import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './http/dto/create-task.dto.js';
import { CreateTaskUseCase } from '../application/use-cases/create-task.use-case.js';
import { TaskPresenter } from './http/presenter/task.presenter.js';
import { GetTaskQuery } from '../application/queries/get-task.query.js';
import { ListTasksQuery } from '../application/queries/list-tasks.query.js';
import { ListTasksQueryDto } from './http/dto/list-tasks-query.dto.js';
import type { StartTaskUseCase } from '../application/use-cases/start-task.use-case.js';
import type { CompleteTaskUseCase } from '../application/use-cases/complete-task.use-case.js';
import type { CancelTaskUseCase } from '../application/use-cases/cancel-task.use-case.js';
import type { ReopenTaskUseCase } from '../application/use-cases/reopen-task.use-case.js';
@Controller({
  path: 'tasks',
  version: '1',
})
export class TasksController {
  constructor(
    private readonly createTask: CreateTaskUseCase,
    private readonly getTask: GetTaskQuery,
    private readonly listTasks: ListTasksQuery,
    private readonly startTask: StartTaskUseCase,
    private readonly completeTask: CompleteTaskUseCase,
    private readonly cancelTask: CancelTaskUseCase,
    private readonly reopenTask: ReopenTaskUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateTaskDto) {
    const task = await this.createTask.execute({
      title: dto.title,
      description: dto.description,
      priority: dto.priority,
      dueAt: dto.dueAt ? new Date(dto.dueAt) : null,
    });

    return TaskPresenter.toHttp(task);
  }

  @Get()
  async findAll(@Query() query: ListTasksQueryDto) {
    const result = await this.listTasks.execute({
      status: query.status,
      priority: query.priority,
      search: query.search?.trim() || undefined,

      dueFrom: query.dueFrom ? new Date(query.dueFrom) : undefined,

      dueTo: query.dueTo ? new Date(query.dueTo) : undefined,

      sort: query.sort,
      order: query.order,

      page: query.page,
      pageSize: query.pageSize,
    });

    return {
      ...result,
      items: result.items.map(TaskPresenter.toHttp),
    };
  }

  @Get(':id')
  async findById(
    @Param('id', new ParseUUIDPipe())
    id: string,
  ) {
    const task = await this.getTask.execute(id);

    return TaskPresenter.toHttp(task);
  }

  @Post(':id/start')
  @HttpCode(HttpStatus.NO_CONTENT)
  async start(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.startTask.execute(id);
  }

  @Post(':id/complete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async complete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.completeTask.execute(id);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancel(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.cancelTask.execute(id);
  }

  @Post(':id/reopen')
  @HttpCode(HttpStatus.NO_CONTENT)
  async reopen(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.reopenTask.execute(id);
  }
}
