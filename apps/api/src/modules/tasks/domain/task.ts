import { InvalidTaskTransitionError } from './errors/invalid-task-transition.error.js';
import { TaskPriority } from './task-priority.js';
import { TaskStatus } from './task-status.js';

export interface TaskProps {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Task {
  private constructor(private props: TaskProps) {}

  static create(params: {
    id: string;
    title: string;
    description?: string | null;
    priority?: TaskPriority;
    dueAt?: Date | null;
    now: Date;
  }): Task {
    return new Task({
      id: params.id,
      title: params.title,
      description: params.description ?? null,
      status: TaskStatus.Todo,
      priority: params.priority ?? TaskPriority.Normal,
      dueAt: params.dueAt ?? null,
      completedAt: null,
      createdAt: params.now,
      updatedAt: params.now,
    });
  }

  static restore(props: TaskProps): Task {
    return new Task(props);
  }

  get id(): string {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string | null {
    return this.props.description;
  }

  get status(): TaskStatus {
    return this.props.status;
  }

  get priority(): TaskPriority {
    return this.props.priority;
  }

  get dueAt(): Date | null {
    return this.props.dueAt;
  }

  get completedAt(): Date | null {
    return this.props.completedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  complete(now: Date): void {
    if (this.props.status === TaskStatus.Cancelled) {
      throw new InvalidTaskTransitionError(this.props.status, TaskStatus.Completed);
    }

    if (this.props.status === TaskStatus.Completed) {
      return;
    }

    this.props.status = TaskStatus.Completed;
    this.props.completedAt = now;
    this.props.updatedAt = now;
  }

  cancel(now: Date): void {
    if (this.props.status === TaskStatus.Completed || this.props.status === TaskStatus.Cancelled) {
      throw new InvalidTaskTransitionError(this.props.status, TaskStatus.Cancelled);
    }

    this.props.status = TaskStatus.Cancelled;
    this.props.completedAt = null;
    this.props.updatedAt = now;
  }

  reopen(now: Date): void {
    const canReopen =
      this.props.status === TaskStatus.Completed || this.props.status === TaskStatus.Cancelled;

    if (!canReopen) {
      throw new InvalidTaskTransitionError(this.props.status, TaskStatus.Todo);
    }

    this.props.status = TaskStatus.Todo;
    this.props.completedAt = null;
    this.props.updatedAt = now;
  }

  start(now: Date): void {
    if (this.props.status !== TaskStatus.Todo) {
      throw new InvalidTaskTransitionError(this.props.status, TaskStatus.InProgress);
    }

    this.props.status = TaskStatus.InProgress;
    this.props.updatedAt = now;
  }

  rename(title: string, now: Date): void {
    this.props.title = title;
    this.props.updatedAt = now;
  }

  changeDescription(description: string | null, now: Date): void {
    this.props.description = description;
    this.props.updatedAt = now;
  }

  changePriority(priority: TaskPriority, now: Date): void {
    this.props.priority = priority;
    this.props.updatedAt = now;
  }

  reschedule(dueAt: Date | null, now: Date): void {
    this.props.dueAt = dueAt;
    this.props.updatedAt = now;
  }
}
