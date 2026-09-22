import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';

import { ApplicationError } from '../errors/application.error.js';
import type { ProblemDetails } from './problem-details.types.js';
import { RequestValidationException } from './request-validation.exception.js';

type RequestWithId = Request & {
  id?: string;
};

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(ProblemDetailsFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();

    const request = context.getRequest<RequestWithId>();
    const response = context.getResponse<Response>();

    const problem = this.mapException(exception, request);

    if (problem.status >= 500) {
      this.logger.error(
        {
          err: exception,
          requestId: problem.requestId,
          method: request.method,
          url: request.originalUrl,
        },
        'Unhandled request exception',
      );
    }

    response.status(problem.status).type('application/problem+json').json(problem);
  }

  private mapException(exception: unknown, request: RequestWithId): ProblemDetails {
    if (exception instanceof RequestValidationException) {
      return {
        type: 'urn:personal-ops:problem:validation-failed',
        title: 'Validation failed',
        status: HttpStatus.BAD_REQUEST,
        detail: 'Request validation failed',
        instance: request.originalUrl,
        code: 'VALIDATION_FAILED',
        requestId: request.id ?? 'unknown',
        errors: exception.validationErrors,
      };
    }

    if (exception instanceof ApplicationError) {
      return this.mapApplicationError(exception, request);
    }

    if (exception instanceof HttpException) {
      return this.mapHttpException(exception, request);
    }

    return {
      type: 'urn:personal-ops:problem:internal-server-error',
      title: 'Internal Server Error',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      detail: 'An unexpected error occurred',
      instance: request.originalUrl,
      code: 'INTERNAL_SERVER_ERROR',
      requestId: request.id ?? 'unknown',
    };
  }

  private mapApplicationError(exception: ApplicationError, request: RequestWithId): ProblemDetails {
    const statusByKind = {
      not_found: HttpStatus.NOT_FOUND,
      conflict: HttpStatus.CONFLICT,
      forbidden: HttpStatus.FORBIDDEN,
      business_rule: HttpStatus.UNPROCESSABLE_ENTITY,
    } satisfies Record<ApplicationError['kind'], number>;

    const status = statusByKind[exception.kind];

    return {
      type: `urn:personal-ops:problem:${exception.code.toLowerCase().replaceAll('_', '-')}`,
      title: this.getTitle(status),
      status,
      detail: exception.message,
      instance: request.originalUrl,
      code: exception.code,
      requestId: request.id ?? 'unknown',
    };
  }

  private mapHttpException(exception: HttpException, request: RequestWithId): ProblemDetails {
    const status = exception.getStatus();

    return {
      type: 'about:blank',
      title: this.getTitle(status),
      status,
      detail: this.getHttpExceptionDetail(exception),
      instance: request.originalUrl,
      code: `HTTP_${status}`,
      requestId: request.id ?? 'unknown',
    };
  }

  private getHttpExceptionDetail(exception: HttpException): string {
    const response = exception.getResponse();

    if (typeof response === 'string') {
      return response;
    }

    if (typeof response === 'object' && response !== null && 'message' in response) {
      const message = response.message;

      if (typeof message === 'string') {
        return message;
      }
    }

    return exception.message;
  }

  private getTitle(status: number): string {
    return HttpStatus[status] ?? 'Request failed';
  }
}
