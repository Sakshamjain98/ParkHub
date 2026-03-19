import { $Enums, BookingTimeline } from '@prisma/client'
import { IsDate, IsString, IsInt, IsOptional } from 'class-validator'
import { RestrictProperties } from 'src/common/dtos/common.input'
import { ApiProperty } from '@nestjs/swagger'

export class BookingTimelineEntity
  implements RestrictProperties<BookingTimelineEntity, BookingTimeline>
{
  @ApiProperty({
    description: 'Unique identifier for the timeline entry',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Timestamp of the status change',
    example: '2024-03-20T08:00:00.000Z',
  })
  timestamp: Date

  @ApiProperty({
    description: 'Booking status at this point in time',
    example: 'CONFIRMED',
    enum: Object.values($Enums.BookingStatus),
  })
  status: $Enums.BookingStatus

  @ApiProperty({
    description: 'ID of the booking this timeline belongs to',
    example: 1,
  })
  bookingId: number

  @IsOptional()
  @ApiProperty({
    description: 'UID of the valet involved in this timeline event',
    example: '550e8400-e29b-41d4-a716-446655440001',
    required: false,
  })
  valetId: string

  @IsOptional()
  @ApiProperty({
    description: 'UID of the manager involved in this timeline event',
    example: '550e8400-e29b-41d4-a716-446655440004',
    required: false,
  })
  managerId: string
}
