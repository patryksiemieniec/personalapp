import { ApiProperty } from '@nestjs/swagger';

import { TaskPriority } from '../../../domain/task-priority.js';
import { TaskStatus } from '../../../domain/task-status.js';

export class TaskResponse {
  @ApiProperty({
    format: 'uuid',
  })
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({
    enum: TaskStatus,
  })
  status!: TaskStatus;

  @ApiProperty({
    enum: TaskPriority,
  })
  priority!: TaskPriority;

  @ApiProperty({
    nullable: true,
    format: 'date-time',
  })
  dueAt!: string | null;

  @ApiProperty({
    nullable: true,
    format: 'date-time',
  })
  completedAt!: string | null;

  @ApiProperty({
    format: 'date-time',
  })
  createdAt!: string;

  @ApiProperty({
    format: 'date-time',
  })
  updatedAt!: string;
}

export class PaginatedTasksResponse {
  @ApiProperty({
    type: [TaskResponse],
  })
  items!: TaskResponse[];

  @ApiProperty()
  page!: number;

  @ApiProperty()
  pageSize!: number;

  @ApiProperty()
  total!: number;
}
