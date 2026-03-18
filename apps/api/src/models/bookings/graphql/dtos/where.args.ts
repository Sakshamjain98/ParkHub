import { Field, InputType, Int, PartialType } from '@nestjs/graphql'
import { $Enums, BookingStatus, Prisma } from '@prisma/client'
import {
  DateTimeFilter,
  FloatFilter,
  IntFilter,
  RestrictProperties,
  StringFilter,
} from 'src/common/dtos/common.input'
import { BookingTimelineListRelationFilter } from 'src/models/booking-timelines/graphql/dtos/where.args'
import { CustomerRelationFilter } from 'src/models/customers/graphql/dtos/where.args'
import { SlotRelationFilter } from 'src/models/slots/graphql/dtos/where.args'
import { ValetAssignmentRelationFilter } from 'src/models/valet-assignments/graphql/dtos/where.args'

@InputType()
export class BookingWhereUniqueInput {
  @Field(() => Int)
  id: number
}

@InputType()
export class EnumBookingStatusFilter {
  @Field(() => BookingStatus, { nullable: true })
  equals: BookingStatus;
  @Field(() => [BookingStatus], { nullable: true })
  in: BookingStatus[]
  @Field(() => [BookingStatus], { nullable: true })
  notIn: BookingStatus[]
  @Field(() => BookingStatus, { nullable: true })
  not: BookingStatus
}

@InputType()
export class BookingWhereInputStrict
  implements
    RestrictProperties<BookingWhereInputStrict, Prisma.BookingWhereInput>
{
  @Field(() => IntFilter, { nullable: true })
  id: IntFilter
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt: DateTimeFilter
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt: DateTimeFilter
  @Field(() => FloatFilter, { nullable: true })
  pricePerHour: FloatFilter
  @Field(() => FloatFilter, { nullable: true })
  totalPrice: FloatFilter
  @Field(() => DateTimeFilter, { nullable: true })
  startTime: DateTimeFilter
  @Field(() => DateTimeFilter, { nullable: true })
  endTime: DateTimeFilter
  @Field(() => StringFilter, { nullable: true })
  vehicleNumber: StringFilter
  @Field(() => StringFilter, { nullable: true })
  phoneNumber: StringFilter
  @Field(() => StringFilter, { nullable: true })
  passcode: StringFilter
  @Field(() => EnumBookingStatusFilter, { nullable: true })
  status: EnumBookingStatusFilter
  @Field(() => IntFilter, { nullable: true })
  slotId: IntFilter
  @Field(() => StringFilter, { nullable: true })
  customerId: StringFilter
  @Field(() => ValetAssignmentRelationFilter, { nullable: true })
  ValetAssignment: ValetAssignmentRelationFilter
  @Field(() => CustomerRelationFilter, { nullable: true })
  Customer: CustomerRelationFilter
  @Field(() => SlotRelationFilter, { nullable: true })
  Slot: SlotRelationFilter
  @Field(() => BookingTimelineListRelationFilter, { nullable: true })
  BookingTimeline: BookingTimelineListRelationFilter

  @Field(() => [BookingWhereInputStrict], { nullable: true })
  AND: BookingWhereInput[]
  @Field(() => [BookingWhereInputStrict], { nullable: true })
  OR: BookingWhereInput[]
  @Field(() => [BookingWhereInputStrict], { nullable: true })
  NOT: BookingWhereInput[]
}

@InputType()
export class BookingWhereInput extends PartialType(BookingWhereInputStrict) {}

@InputType()
export class BookingListRelationFilter {
  @Field(() => BookingWhereInput, { nullable: true })
  every?: BookingWhereInput
  @Field(() => BookingWhereInput, { nullable: true })
  some?: BookingWhereInput
  @Field(() => BookingWhereInput, { nullable: true })
  none?: BookingWhereInput
}

@InputType()
export class BookingRelationFilter {
  @Field(() => BookingWhereInput, { nullable: true })
  is?: BookingWhereInput
  @Field(() => BookingWhereInput, { nullable: true })
  isNot?: BookingWhereInput
}
