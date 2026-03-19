import { ValetAssignment } from '@prisma/client'
import { IsDate, IsString, IsInt, IsOptional } from 'class-validator'
import { RestrictProperties } from 'src/common/dtos/common.input'
import { ApiProperty } from '@nestjs/swagger'

export class ValetAssignmentEntity
  implements RestrictProperties<ValetAssignmentEntity, ValetAssignment>
{
  @ApiProperty({
    description: 'ID of the booking this valet assignment belongs to',
    example: 1,
  })
  bookingId: number

  @ApiProperty({
    description: 'Assignment creation timestamp',
    example: '2024-03-19T10:30:45.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-03-19T15:45:20.000Z',
  })
  updatedAt: Date

  @ApiProperty({
    description: 'Latitude of pickup location',
    example: 40.7128,
  })
  pickupLat: number

  @ApiProperty({
    description: 'Longitude of pickup location',
    example: -74.006,
  })
  pickupLng: number

  @IsOptional()
  @ApiProperty({
    description: 'Latitude of return location',
    example: 40.758,
    required: false,
  })
  returnLat: number

  @IsOptional()
  @ApiProperty({
    description: 'Longitude of return location',
    example: -73.9855,
    required: false,
  })
  returnLng: number

  @ApiProperty({
    description: 'UID of the valet assigned for pickup',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  pickupValetId: string

  @ApiProperty({
    description: 'UID of the valet assigned for return',
    example: '550e8400-e29b-41d4-a716-446655440005',
  })
  returnValetId: string
}
