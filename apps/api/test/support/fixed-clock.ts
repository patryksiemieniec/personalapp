import type { Clock } from '../../src/modules/tasks/application/ports/clock.js';

export class FixedClock implements Clock {
  constructor(private readonly date: Date) {}

  now(): Date {
    return this.date;
  }
}
