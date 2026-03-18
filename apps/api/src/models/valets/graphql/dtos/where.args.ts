import { Field, InputType, PartialType } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import {
  DateTimeFilter,
  IntFilter,
  RestrictProperties,
  StringFilter,
} from 'src/common/dtos/common.input'
import { BookingTimelineListRelationFilter } from 'src/models/booking-timelines/graphql/dtos/where.args'
import { CompanyRelationFilter } from 'src/models/companies/graphql/dtos/where.args'
import { UserRelationFilter } from 'src/models/users/graphql/dtos/where.args'
import { ValetAssignmentListRelationFilter } from 'src/models/valet-assignments/graphql/dtos/where.args'

@InputType()
export class ValetWhereUniqueInput {
  @Field(() => String)
  uid: string
}

@InputType()
export class ValetWhereInputStrict
  implements RestrictProperties<ValetWhereInputStrict, Prisma.ValetWhereInput>
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
  @Field(() => StringFilter, { nullable: true })
  image: StringFilter
  @Field(() => StringFilter, { nullable: true })
  licenceID: StringFilter
  @Field(() => IntFilter, { nullable: true })
  companyId: IntFilter
  @Field(() => CompanyRelationFilter, { nullable: true })
  Company: CompanyRelationFilter
  @Field(() => BookingTimelineListRelationFilter, { nullable: true })
  BookingTimeline: BookingTimelineListRelationFilter
  @Field(() => ValetAssignmentListRelationFilter, { nullable: true })
  PickupAssignments: ValetAssignmentListRelationFilter
  @Field(() => ValetAssignmentListRelationFilter, { nullable: true })
  ReturnAssignments: ValetAssignmentListRelationFilter

  @Field(() => [ValetWhereInputStrict], { nullable: true })
  AND: ValetWhereInput[]
  @Field(() => [ValetWhereInputStrict], { nullable: true })
  OR: ValetWhereInput[]
  @Field(() => [ValetWhereInputStrict], { nullable: true })
  NOT: ValetWhereInput[]
}

@InputType()
export class ValetWhereInput extends PartialType(ValetWhereInputStrict) {}

@InputType()
export class ValetListRelationFilter {
  @Field(() => ValetWhereInput, { nullable: true })
  every?: ValetWhereInput
  @Field(() => ValetWhereInput, { nullable: true })
  some?: ValetWhereInput
  @Field(() => ValetWhereInput, { nullable: true })
  none?: ValetWhereInput
}

@InputType()
export class ValetRelationFilter {
  @Field(() => ValetWhereInput, { nullable: true })
  is?: ValetWhereInput
  @Field(() => ValetWhereInput, { nullable: true })
  isNot?: ValetWhereInput
}
