import { InvalidTaskTransitionError } from '../../domain/errors/invalid-task-transition.error.js';
import { InvalidTaskTransitionApplicationError } from './invalid-task-transition.error.js';

export function mapTaskDomainError(error: unknown): never {
  if (error instanceof InvalidTaskTransitionError) {
    throw new InvalidTaskTransitionApplicationError(error.message);
  }

  throw error;
}
