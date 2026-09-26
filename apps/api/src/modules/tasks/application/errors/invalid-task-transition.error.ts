import { ApplicationError } from '../../../../common/errors/application.error.js';

export class InvalidTaskTransitionApplicationError extends ApplicationError {
  constructor(message: string) {
    super('INVALID_TASK_TRANSITION', message, 'conflict');
  }
}
