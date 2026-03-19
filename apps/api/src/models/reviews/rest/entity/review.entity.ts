import { Review } from '@prisma/client'
import { IsDate, IsString, IsInt, IsOptional } from 'class-validator'
import { RestrictProperties } from 'src/common/dtos/common.input'
import { ApiProperty } from '@nestjs/swagger'

export class ReviewEntity implements RestrictProperties<ReviewEntity, Review> {
  @ApiProperty({
    description: 'Unique identifier for the review',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Review creation timestamp',
    example: '2024-03-19T10:30:45.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-03-19T15:45:20.000Z',
  })
  updatedAt: Date

  @ApiProperty({
    description: 'Rating from 1 to 5 stars',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  rating: number

  @IsOptional()
  @ApiProperty({
    description: 'Free-form comment text for the review',
    example: 'Great service and clean facilities',
    required: false,
  })
  comment: string

  @ApiProperty({
    description: 'UID of the customer who left the review',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  customerId: string

  @ApiProperty({
    description: 'ID of the garage being reviewed',
    example: 1,
  })
  garageId: number
}
