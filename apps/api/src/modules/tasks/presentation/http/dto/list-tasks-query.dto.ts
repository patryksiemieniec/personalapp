import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { TaskPriority } from '../../../domain/task-priority.js';
import { TaskStatus } from '../../../domain/task-status.js';

export enum TaskSortFieldDto {
  CreatedAt = 'createdAt',
  DueAt = 'dueAt',
  Priority = 'priority',
}

export enum SortOrderDto {
  Asc = 'asc',
  Desc = 'desc',
}

export class ListTasksQueryDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsDateString()
  dueFrom?: string;

  @IsOptional()
  @IsDateString()
  dueTo?: string;

  @IsOptional()
  @IsEnum(TaskSortFieldDto)
  sort: TaskSortFieldDto = TaskSortFieldDto.CreatedAt;

  @IsOptional()
  @IsEnum(SortOrderDto)
  order: SortOrderDto = SortOrderDto.Desc;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize = 20;
}
