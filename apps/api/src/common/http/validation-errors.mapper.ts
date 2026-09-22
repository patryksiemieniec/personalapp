import type { ValidationError } from 'class-validator';
import type { ValidationProblem } from './problem-details.types.js';

export function mapValidationErrors(
  errors: ValidationError[],
  parentPath = '',
): ValidationProblem[] {
  return errors.flatMap((error) => {
    const field = parentPath ? `${parentPath}.${error.property}` : error.property;

    const currentErrors: ValidationProblem[] = error.constraints
      ? [
          {
            field,
            messages: Object.values(error.constraints),
          },
        ]
      : [];

    const nestedErrors =
      error.children && error.children.length > 0 ? mapValidationErrors(error.children, field) : [];

    return [...currentErrors, ...nestedErrors];
  });
}
