export class TaskNotFoundError extends Error {
  constructor(public readonly taskId: string) {
    super(`Task "${taskId}" was not found`);

    this.name = TaskNotFoundError.name;
  }
}
