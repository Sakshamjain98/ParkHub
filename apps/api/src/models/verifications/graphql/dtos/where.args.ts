import { Field, InputType, Int, PartialType } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import {
  BoolFilter,
  DateTimeFilter,
  IntFilter,
  RestrictProperties,
  StringFilter,
} from 'src/common/dtos/common.input'
import { AdminRelationFilter } from 'src/models/admins/graphql/dtos/where.args'
import { GarageRelationFilter } from 'src/models/garages/graphql/dtos/where.args'

@InputType()
export class VerificationWhereUniqueInput {
  @Field(() => Int)
  garageId: number
}

@InputType()
export class VerificationWhereInputStrict
  implements
    RestrictProperties<
      VerificationWhereInputStrict,
      Prisma.VerificationWhereInput
    >
{
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt: DateTimeFilter
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt: DateTimeFilter
  @Field(() => BoolFilter, { nullable: true })
  verified: BoolFilter
  @Field(() => StringFilter, { nullable: true })
  adminId: StringFilter
  @Field(() => IntFilter, { nullable: true })
  garageId: IntFilter
  @Field(() => AdminRelationFilter, { nullable: true })
  Admin: AdminRelationFilter
  @Field(() => GarageRelationFilter, { nullable: true })
  Garage: GarageRelationFilter

  @Field(() => [VerificationWhereInputStrict], { nullable: true })
  AND: VerificationWhereInput[]
  @Field(() => [VerificationWhereInputStrict], { nullable: true })
  OR: VerificationWhereInput[]
  @Field(() => [VerificationWhereInputStrict], { nullable: true })
  NOT: VerificationWhereInput[]
}

@InputType()
export class VerificationWhereInput extends PartialType(
  VerificationWhereInputStrict,
) {}

@InputType()
export class VerificationListRelationFilter {
  @Field(() => VerificationWhereInput, { nullable: true })
  every?: VerificationWhereInput
  @Field(() => VerificationWhereInput, { nullable: true })
  some?: VerificationWhereInput
  @Field(() => VerificationWhereInput, { nullable: true })
  none?: VerificationWhereInput
}

@InputType()
export class VerificationRelationFilter {
  @Field(() => VerificationWhereInput, { nullable: true })
  is?: VerificationWhereInput
  @Field(() => VerificationWhereInput, { nullable: true })
  isNot?: VerificationWhereInput
}
