export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;

  code: string;
  requestId: string;

  errors?: ValidationProblem[];
}

export interface ValidationProblem {
  field: string;
  messages: string[];
}
