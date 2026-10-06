import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProblemDetailsResponse {
  @ApiProperty()
  type!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  status!: number;

  @ApiProperty()
  detail!: string;

  @ApiProperty()
  instance!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  requestId!: string;

  @ApiPropertyOptional()
  errors?: Array<{
    field: string;
    messages: string[];
  }>;
}
