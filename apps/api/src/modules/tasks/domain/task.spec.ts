import { describe, expect, it } from 'vitest';

import { InvalidTaskTransitionError } from './errors/invalid-task-transition.error.js';
import { TaskPriority } from './task-priority.js';
import { TaskStatus } from './task-status.js';
import { Task } from './task.js';

const NOW = new Date('2026-09-23T12:00:00.000Z');

function createTask(): Task {
  return Task.create({
    id: '71fd774e-8dd6-4c55-a762-c0358b6a4912',
    title: 'Buy engine oil',
    now: NOW,
  });
}

describe('Task', () => {
  it('creates a new task in todo state', () => {
    const task = createTask();

    expect(task.status).toBe(TaskStatus.Todo);
    expect(task.priority).toBe(TaskPriority.Normal);
    expect(task.completedAt).toBeNull();
    expect(task.createdAt).toEqual(NOW);
    expect(task.updatedAt).toEqual(NOW);
  });

  it('starts a todo task', () => {
    const task = createTask();

    const startedAt = new Date('2026-09-23T13:00:00.000Z');

    task.start(startedAt);

    expect(task.status).toBe(TaskStatus.InProgress);
    expect(task.updatedAt).toEqual(startedAt);
  });

  it('completes an in-progress task', () => {
    const task = createTask();

    task.start(new Date('2026-09-23T13:00:00.000Z'));

    const completedAt = new Date('2026-09-23T14:00:00.000Z');

    task.complete(completedAt);

    expect(task.status).toBe(TaskStatus.Completed);
    expect(task.completedAt).toEqual(completedAt);
    expect(task.updatedAt).toEqual(completedAt);
  });

  it('does not allow completing a cancelled task', () => {
    const task = createTask();

    task.cancel(new Date('2026-09-23T13:00:00.000Z'));

    expect(() => task.complete(new Date('2026-09-23T14:00:00.000Z'))).toThrow(
      InvalidTaskTransitionError,
    );
  });

  it('reopens a completed task', () => {
    const task = createTask();

    task.complete(new Date('2026-09-23T13:00:00.000Z'));

    const reopenedAt = new Date('2026-09-23T14:00:00.000Z');

    task.reopen(reopenedAt);

    expect(task.status).toBe(TaskStatus.Todo);
    expect(task.completedAt).toBeNull();
    expect(task.updatedAt).toEqual(reopenedAt);
  });
});
