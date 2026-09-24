import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateTaskDto } from './http/dto/create-task.dto.js';
import { CreateTaskUseCase } from '../application/use-cases/create-task.use-case.js';
import { TaskPresenter } from './http/presenter/task.presenter.js';
@Controller({
  path: 'tasks',
  version: '1',
})
export class TasksController {
  constructor(private readonly createTask: CreateTaskUseCase) {}

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
}
