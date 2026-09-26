import { Inject, Injectable } from '@nestjs/common';
import { TASK_REPOSITORY, type TaskRepository } from '../../../domain/task.repository.js';
import { CLOCK, type Clock } from '../../ports/clock.js';
import { ID_GENERATOR, type IdGenerator } from '../../ports/id-generator.js';
import { Task } from '../../../domain/task.js';
import type { CreateTaskCommand } from './create-task.command.js';

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,

    @Inject(CLOCK)
    private readonly clock: Clock,

    @Inject(ID_GENERATOR)
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(command: CreateTaskCommand): Promise<Task> {
    const now = this.clock.now();

    const task = Task.create({
      id: this.idGenerator.generate(),
      title: command.title,
      description: command.description,
      priority: command.priority,
      dueAt: command.dueAt,
      now,
    });

    await this.taskRepository.save(task);

    return task;
  }
}
