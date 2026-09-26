import { ApplicationError } from '../../../../common/errors/application.error.js';

export class TaskNotFoundError extends ApplicationError {
  constructor(taskId: string) {
    super('TASK_NOT_FOUND', `Task "${taskId}" was not found`, 'not_found');
  }
}
