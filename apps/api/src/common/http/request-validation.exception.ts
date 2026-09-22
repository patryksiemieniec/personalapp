import { BadRequestException } from '@nestjs/common';
import type { ValidationProblem } from './problem-details.types.js';

export class RequestValidationException extends BadRequestException {
  constructor(public readonly validationErrors: ValidationProblem[]) {
    super('Request validation failed');
  }
}
