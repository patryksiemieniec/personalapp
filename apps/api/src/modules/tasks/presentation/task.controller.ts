import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './http/dto/create-task.dto.js';
import { CreateTaskUseCase } from '../application/use-cases/create-task/create-task.use-case.js';
import { TaskPresenter } from './http/presenter/task.presenter.js';
import { GetTaskQuery } from '../application/queries/get-task.query.js';
import { ListTasksQuery } from '../application/queries/list-tasks.query.js';
import { ListTasksQueryDto } from './http/dto/list-tasks-query.dto.js';
import { StartTaskUseCase } from '../application/use-cases/start-task/start-task.use-case.js';
import { CompleteTaskUseCase } from '../application/use-cases/complete-task/complete-task.use-case.js';
import { CancelTaskUseCase } from '../application/use-cases/cancel-task/cancel-task.use-case.js';
import { ReopenTaskUseCase } from '../application/use-cases/reopen-task/reopen-task.use-case.js';
import { UpdateTaskDto } from './http/dto/update-task.dto.js';
import { UpdateTaskUseCase } from '../application/use-cases/update-task/update-task.use-case.js';
import { DeleteTaskUseCase } from '../application/use-cases/delete-task/delete-task.use-case.js';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedTasksResponse, TaskResponse } from './http/model/task-response.js';

@ApiTags('tasks')
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
    private readonly updateTask: UpdateTaskUseCase,
    private readonly deleteTask: DeleteTaskUseCase,
  ) {}

  @ApiCreatedResponse({
    type: TaskResponse,
  })
  @Post()
  async create(@Body() dto: CreateTaskDto) {
    const task = await this.createTask.execute({
      title: dto.title,
      description: dto.description,
      priority: dto.priority,
      dueAt: dto.dueAt ? new Date(dto.dueAt) : null,
    });

    return TaskPresenter.toHttp(task);
  }

  @ApiOkResponse({
    type: PaginatedTasksResponse,
  })
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

  @ApiOkResponse({
    type: TaskResponse,
  })
  @Get(':id')
  async findById(
    @Param('id', new ParseUUIDPipe())
    id: string,
  ) {
    const task = await this.getTask.execute(id);

    return TaskPresenter.toHttp(task);
  }

  @ApiOkResponse({
    type: TaskResponse,
  })
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe())
    id: string,

    @Body()
    dto: UpdateTaskDto,
  ) {
    const task = await this.updateTask.execute(id, {
      title: dto.title,
      description: dto.description,
      priority: dto.priority,
      dueAt: dto.dueAt === undefined ? undefined : dto.dueAt === null ? null : new Date(dto.dueAt),
    });

    return TaskPresenter.toHttp(task);
  }

  @ApiNoContentResponse()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', new ParseUUIDPipe())
    id: string,
  ): Promise<void> {
    await this.deleteTask.execute(id);
  }

  @ApiNoContentResponse()
  @Post(':id/start')
  @HttpCode(HttpStatus.NO_CONTENT)
  async start(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.startTask.execute(id);
  }

  @ApiNoContentResponse()
  @Post(':id/complete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async complete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.completeTask.execute(id);
  }

  @ApiNoContentResponse()
  @Post(':id/cancel')
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancel(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.cancelTask.execute(id);
  }

  @ApiNoContentResponse()
  @Post(':id/reopen')
  @HttpCode(HttpStatus.NO_CONTENT)
  async reopen(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.reopenTask.execute(id);
  }
}
