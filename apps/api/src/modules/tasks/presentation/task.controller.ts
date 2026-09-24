import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CreateTaskDto } from './http/dto/create-task.dto.js';
import { CreateTaskUseCase } from '../application/use-cases/create-task.use-case.js';
import { TaskPresenter } from './http/presenter/task.presenter.js';
import { GetTaskQuery } from '../application/queries/get-task.query.js';
import { ListTasksQuery } from '../application/queries/list-tasks.query.js';
@Controller({
  path: 'tasks',
  version: '1',
})
export class TasksController {
  constructor(
    private readonly createTask: CreateTaskUseCase,
    private readonly getTask: GetTaskQuery,
    private readonly listTasks: ListTasksQuery,
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
  async findAll() {
    const tasks = await this.listTasks.execute();

    return tasks.map(TaskPresenter.toHttp);
  }

  @Get(':id')
  async findById(
    @Param('id', new ParseUUIDPipe())
    id: string,
  ) {
    const task = await this.getTask.execute(id);

    return TaskPresenter.toHttp(task);
  }
}
