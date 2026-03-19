import { IsIn, IsNumberString, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class BaseQueryDto {
  @IsNumberString()
  @IsOptional()
  @ApiProperty({
    description: 'Number of records to skip for pagination',
    example: 0,
    required: false,
  })
  skip?: number

  @IsNumberString()
  @IsOptional()
  @ApiProperty({
    description: 'Number of records to return (capped by MAX_QUERY_TAKE)',
    example: 10,
    required: false,
  })
  take?: number

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Search keyword for filtering results',
    example: 'downtown',
    required: false,
  })
  search?: string

  @IsOptional()
  @IsIn(['asc', 'desc'])
  @ApiProperty({
    description: 'Sort order for results',
    enum: ['asc', 'desc'],
    example: 'asc',
    required: false,
  })
  order?: 'asc' | 'desc'
}
