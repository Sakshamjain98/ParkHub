import { TotalPrice } from '@autospace/util/types'
import { CreateBookingInput } from 'src/models/bookings/graphql/dtos/create-booking.input'
import { IsNotEmpty, IsObject, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateStripeDto {
  @ApiProperty({
    description: 'Authenticated user id creating the checkout session.',
    example: '2d0d1a67-5f8a-45f8-a67e-97e6c9050d9e',
  })
  @IsString()
  @IsNotEmpty()
  uid: string

  @ApiProperty({
    description: 'Checkout price breakdown where values are USD amounts.',
    type: 'object',
    additionalProperties: { type: 'number' },
    example: {
      parking: 15,
      tax: 2.7,
      convenienceFee: 1,
    },
  })
  @IsObject()
  totalPriceObj: TotalPrice

  @ApiProperty({
    description: 'Booking payload persisted after verified Stripe webhook.',
    type: 'object',
    example: {
      customerId: '2d0d1a67-5f8a-45f8-a67e-97e6c9050d9e',
      garageId: 1,
      type: 'CAR',
      startTime: '2026-03-18T10:00:00.000Z',
      endTime: '2026-03-18T13:00:00.000Z',
      vehicleNumber: 'DL8CAF1234',
      phoneNumber: '+91XXXXXXXXXX',
      pricePerHour: 5,
      totalPrice: 15,
    },
  })
  @IsObject()
  bookingData: CreateBookingInput
}
