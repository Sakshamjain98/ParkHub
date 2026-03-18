import { Field, InputType, PartialType } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import {
  DateTimeFilter,
  RestrictProperties,
  StringFilter,
} from 'src/common/dtos/common.input'
import { BookingListRelationFilter } from 'src/models/bookings/graphql/dtos/where.args'
import { ReviewListRelationFilter } from 'src/models/reviews/graphql/dtos/where.args'
import { UserRelationFilter } from 'src/models/users/graphql/dtos/where.args'

@InputType()
export class CustomerWhereUniqueInput {
  @Field(() => String)
  uid: string
}

@InputType()
export class CustomerWhereInputStrict
  implements
    RestrictProperties<CustomerWhereInputStrict, Prisma.CustomerWhereInput>
{
  @Field(() => UserRelationFilter, { nullable: true })
  User: UserRelationFilter
  @Field(() => StringFilter, { nullable: true })
  uid: StringFilter
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt: DateTimeFilter
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt: DateTimeFilter
  @Field(() => StringFilter, { nullable: true })
  displayName: StringFilter
  @Field(() => BookingListRelationFilter, { nullable: true })
  Bookings: BookingListRelationFilter
  @Field(() => ReviewListRelationFilter, { nullable: true })
  Reviews: ReviewListRelationFilter

  @Field(() => [CustomerWhereInputStrict], { nullable: true })
  AND: CustomerWhereInput[]
  @Field(() => [CustomerWhereInputStrict], { nullable: true })
  OR: CustomerWhereInput[]
  @Field(() => [CustomerWhereInputStrict], { nullable: true })
  NOT: CustomerWhereInput[]
}

@InputType()
export class CustomerWhereInput extends PartialType(CustomerWhereInputStrict) {}

@InputType()
export class CustomerListRelationFilter {
  @Field(() => CustomerWhereInput, { nullable: true })
  every?: CustomerWhereInput
  @Field(() => CustomerWhereInput, { nullable: true })
  some?: CustomerWhereInput
  @Field(() => CustomerWhereInput, { nullable: true })
  none?: CustomerWhereInput
}

@InputType()
export class CustomerRelationFilter {
  @Field(() => CustomerWhereInput, { nullable: true })
  is?: CustomerWhereInput
  @Field(() => CustomerWhereInput, { nullable: true })
  isNot?: CustomerWhereInput
}
