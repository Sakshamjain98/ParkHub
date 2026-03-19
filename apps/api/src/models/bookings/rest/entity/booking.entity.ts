import { $Enums, Booking } from '@prisma/client'
import { IsDate, IsString, IsInt, IsOptional } from 'class-validator'
import { RestrictProperties } from 'src/common/dtos/common.input'
import { ApiProperty } from '@nestjs/swagger'

export class BookingEntity
  implements RestrictProperties<BookingEntity, Booking>
{
  @ApiProperty({
    description: 'Unique identifier for the booking',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Booking creation timestamp',
    example: '2024-03-19T10:30:45.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-03-19T15:45:20.000Z',
  })
  updatedAt: Date

  @IsOptional()
  @ApiProperty({
    description: 'Price per hour for this booking',
    example: 5.99,
    required: false,
  })
  pricePerHour: number

  @IsOptional()
  @ApiProperty({
    description: 'Total price for the entire booking duration',
    example: 47.92,
    required: false,
  })
  totalPrice: number

  @ApiProperty({
    description: 'Start date and time of the booking',
    example: '2024-03-20T08:00:00.000Z',
  })
  startTime: Date

  @ApiProperty({
    description: 'End date and time of the booking',
    example: '2024-03-20T16:00:00.000Z',
  })
  endTime: Date

  @ApiProperty({
    description: 'Vehicle license plate number',
    example: 'ABC1234',
  })
  vehicleNumber: string

  @IsOptional()
  @ApiProperty({
    description: 'Customer phone number for contact',
    example: '(555) 123-4567',
    required: false,
  })
  phoneNumber: string

  @IsOptional()
  @ApiProperty({
    description: 'Access passcode for the booking',
    example: '1234',
    required: false,
  })
  passcode: string

  @ApiProperty({
    description: 'Current status of the booking',
    example: 'CONFIRMED',
    enum: Object.values($Enums.BookingStatus),
  })
  status: $Enums.BookingStatus

  @ApiProperty({
    description: 'ID of the parking slot',
    example: 1,
  })
  slotId: number

  @ApiProperty({
    description: 'UID of the customer who made the booking',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  customerId: string
}
