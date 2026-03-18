import { Field, InputType, Int, PartialType } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import {
  DateTimeFilter,
  IntFilter,
  RestrictProperties,
  StringFilter,
} from 'src/common/dtos/common.input'
import { CustomerRelationFilter } from 'src/models/customers/graphql/dtos/where.args'
import { GarageRelationFilter } from 'src/models/garages/graphql/dtos/where.args'

@InputType()
export class ReviewWhereUniqueInput {
  @Field(() => Int)
  id: number
}

@InputType()
export class ReviewWhereInputStrict
  implements
    RestrictProperties<ReviewWhereInputStrict, Prisma.ReviewWhereInput>
{
  @Field(() => IntFilter, { nullable: true })
  id: IntFilter
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt: DateTimeFilter
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt: DateTimeFilter
  @Field(() => IntFilter, { nullable: true })
  rating: IntFilter
  @Field(() => StringFilter, { nullable: true })
  comment: StringFilter
  @Field(() => StringFilter, { nullable: true })
  customerId: StringFilter
  @Field(() => IntFilter, { nullable: true })
  garageId: IntFilter
  @Field(() => CustomerRelationFilter, { nullable: true })
  Customer: CustomerRelationFilter
  @Field(() => GarageRelationFilter, { nullable: true })
  Garage: GarageRelationFilter

  @Field(() => [ReviewWhereInputStrict], { nullable: true })
  AND: ReviewWhereInput[]
  @Field(() => [ReviewWhereInputStrict], { nullable: true })
  OR: ReviewWhereInput[]
  @Field(() => [ReviewWhereInputStrict], { nullable: true })
  NOT: ReviewWhereInput[]
}

@InputType()
export class ReviewWhereInput extends PartialType(ReviewWhereInputStrict) {}

@InputType()
export class ReviewListRelationFilter {
  @Field(() => ReviewWhereInput, { nullable: true })
  every?: ReviewWhereInput
  @Field(() => ReviewWhereInput, { nullable: true })
  some?: ReviewWhereInput
  @Field(() => ReviewWhereInput, { nullable: true })
  none?: ReviewWhereInput
}

@InputType()
export class ReviewRelationFilter {
  @Field(() => ReviewWhereInput, { nullable: true })
  is?: ReviewWhereInput
  @Field(() => ReviewWhereInput, { nullable: true })
  isNot?: ReviewWhereInput
}
