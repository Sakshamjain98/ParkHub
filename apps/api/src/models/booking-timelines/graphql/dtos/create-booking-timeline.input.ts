import { Field, InputType, Int } from '@nestjs/graphql'
import { BookingStatus } from '@prisma/client'
import { IsEnum, IsInt } from 'class-validator'

@InputType()
export class CreateBookingTimelineInput {
  @IsInt()
  @Field(() => Int)
  bookingId: number

  @IsEnum(BookingStatus)
  @Field(() => BookingStatus)
  status: BookingStatus
}
