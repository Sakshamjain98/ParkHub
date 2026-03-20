import { CreateBookingTimelineInput } from './create-booking-timeline.input'
import { Field, InputType, Int, PartialType } from '@nestjs/graphql'
import { BookingTimeline } from '@prisma/client'
import { IsInt } from 'class-validator'

@InputType()
export class UpdateBookingTimelineInput extends PartialType(
  CreateBookingTimelineInput,
) {
  @IsInt()
  @Field(() => Int)
  id: BookingTimeline['id']
}
