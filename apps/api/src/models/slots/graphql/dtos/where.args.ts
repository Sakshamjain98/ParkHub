import { Field, InputType, Int, PartialType } from '@nestjs/graphql'
import { $Enums, Prisma } from '@prisma/client'
import {
  DateTimeFilter,
  FloatFilter,
  IntFilter,
  RestrictProperties,
  StringFilter,
} from 'src/common/dtos/common.input'
import { BookingListRelationFilter } from 'src/models/bookings/graphql/dtos/where.args'
import { GarageRelationFilter } from 'src/models/garages/graphql/dtos/where.args'

@InputType()
export class SlotWhereUniqueInput {
  @Field(() => Int)
  id: number
}

@InputType()
export class EnumSlotTypeFilter {
  @Field(() => $Enums.SlotType, { nullable: true })
  equals?: $Enums.SlotType;
  @Field(() => [$Enums.SlotType], { nullable: true })
  in?: $Enums.SlotType[]
  @Field(() => [$Enums.SlotType], { nullable: true })
  notIn?: $Enums.SlotType[]
  @Field(() => $Enums.SlotType, { nullable: true })
  not?: $Enums.SlotType
}

@InputType()
export class SlotWhereInputStrict
  implements RestrictProperties<SlotWhereInputStrict, Prisma.SlotWhereInput>
{
  @Field(() => IntFilter, { nullable: true })
  id: IntFilter
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt: DateTimeFilter
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt: DateTimeFilter
  @Field(() => StringFilter, { nullable: true })
  displayName: StringFilter
  @Field(() => FloatFilter, { nullable: true })
  pricePerHour: FloatFilter
  @Field(() => IntFilter, { nullable: true })
  length: IntFilter
  @Field(() => IntFilter, { nullable: true })
  width: IntFilter
  @Field(() => IntFilter, { nullable: true })
  height: IntFilter
  @Field(() => EnumSlotTypeFilter, { nullable: true })
  type: EnumSlotTypeFilter
  @Field(() => IntFilter, { nullable: true })
  garageId: IntFilter
  @Field(() => GarageRelationFilter, { nullable: true })
  Garage: GarageRelationFilter
  @Field(() => BookingListRelationFilter, { nullable: true })
  Bookings: BookingListRelationFilter

  @Field(() => [SlotWhereInputStrict], { nullable: true })
  AND: SlotWhereInput[]
  @Field(() => [SlotWhereInputStrict], { nullable: true })
  OR: SlotWhereInput[]
  @Field(() => [SlotWhereInputStrict], { nullable: true })
  NOT: SlotWhereInput[]
}

@InputType()
export class SlotWhereInput extends PartialType(SlotWhereInputStrict) {}

@InputType()
export class SlotListRelationFilter {
  @Field(() => SlotWhereInput, { nullable: true })
  every?: SlotWhereInput
  @Field(() => SlotWhereInput, { nullable: true })
  some?: SlotWhereInput
  @Field(() => SlotWhereInput, { nullable: true })
  none?: SlotWhereInput
}

@InputType()
export class SlotRelationFilter {
  @Field(() => SlotWhereInput, { nullable: true })
  is?: SlotWhereInput
  @Field(() => SlotWhereInput, { nullable: true })
  isNot?: SlotWhereInput
}
