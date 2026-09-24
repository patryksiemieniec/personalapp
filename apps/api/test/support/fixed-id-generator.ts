import type { IdGenerator } from '../../src/modules/tasks/application/ports/id-generator.js';

export class FixedIdGenerator implements IdGenerator {
  constructor(private readonly id: string) {}

  generate(): string {
    return this.id;
  }
}
