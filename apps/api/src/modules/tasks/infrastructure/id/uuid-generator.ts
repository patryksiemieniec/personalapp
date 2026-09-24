import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import type { IdGenerator } from '../../application/ports/id-generator.js';

@Injectable()
export class UuidGenerator implements IdGenerator {
  generate(): string {
    return randomUUID();
  }
}
