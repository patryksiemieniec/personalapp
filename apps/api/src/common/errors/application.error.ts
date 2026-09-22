export type ApplicationErrorKind = 'not_found' | 'conflict' | 'forbidden' | 'business_rule';

export class ApplicationError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly kind: ApplicationErrorKind,
  ) {
    super(message);

    this.name = new.target.name;
  }
}
