import { describe, expect, it } from 'vitest';

import { FixedClock } from '../../../../../test/support/fixed-clock.js';
import { FixedIdGenerator } from '../../../../../test/support/fixed-id-generator.js';
import { InMemoryTaskRepository } from '../../../../../test/support/in-memory-task.repository.js';

import { TaskPriority } from '../../domain/task-priority.js';
import { TaskStatus } from '../../domain/task-status.js';
import { CreateTaskUseCase } from './create-task.use-case.js';

describe('CreateTaskUseCase', () => {
  it('creates and persists a task', async () => {
    const now = new Date('2026-09-23T12:00:00.000Z');

    const id = '71fd774e-8dd6-4c55-a762-c0358b6a4912';

    const repository = new InMemoryTaskRepository();

    const useCase = new CreateTaskUseCase(
      repository,
      new FixedClock(now),
      new FixedIdGenerator(id),
    );

    const task = await useCase.execute({
      title: 'Buy engine oil',
      priority: TaskPriority.High,
    });

    expect(task.id).toBe(id);
    expect(task.title).toBe('Buy engine oil');
    expect(task.priority).toBe(TaskPriority.High);
    expect(task.status).toBe(TaskStatus.Todo);
    expect(task.createdAt).toEqual(now);

    expect(await repository.findById(id)).toBe(task);
  });
});
