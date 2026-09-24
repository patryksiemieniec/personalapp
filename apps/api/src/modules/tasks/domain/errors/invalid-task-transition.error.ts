import { TaskStatus } from '../task-status.js';

export class InvalidTaskTransitionError extends Error {
  constructor(
    public readonly from: TaskStatus,
    public readonly to: TaskStatus,
  ) {
    super(`Task cannot transition from "${from}" to "${to}"`);

    this.name = InvalidTaskTransitionError.name;
  }
}
