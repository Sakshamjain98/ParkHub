import { Field, InputType, PartialType } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import {
  DateTimeFilter,
  RestrictProperties,
  StringFilter,
} from 'src/common/dtos/common.input'
import { UserRelationFilter } from 'src/models/users/graphql/dtos/where.args'
import { VerificationListRelationFilter } from 'src/models/verifications/graphql/dtos/where.args'

@InputType()
export class AdminWhereUniqueInput {
  @Field(() => String)
  uid: string
}

@InputType()
export class AdminWhereInputStrict
  implements RestrictProperties<AdminWhereInputStrict, Prisma.AdminWhereInput>
{
  @Field(() => VerificationListRelationFilter, { nullable: true })
  Verifications: VerificationListRelationFilter
  @Field(() => StringFilter, { nullable: true })
  uid: StringFilter
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt: DateTimeFilter
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt: DateTimeFilter
  @Field(() => UserRelationFilter, { nullable: true })
  User: UserRelationFilter

  @Field(() => [AdminWhereInputStrict], { nullable: true })
  AND: AdminWhereInput[]
  @Field(() => [AdminWhereInputStrict], { nullable: true })
  OR: AdminWhereInput[]
  @Field(() => [AdminWhereInputStrict], { nullable: true })
  NOT: AdminWhereInput[]
}

@InputType()
export class AdminWhereInput extends PartialType(AdminWhereInputStrict) {}

@InputType()
export class AdminListRelationFilter {
  @Field(() => AdminWhereInput, { nullable: true })
  every?: AdminWhereInput
  @Field(() => AdminWhereInput, { nullable: true })
  some?: AdminWhereInput
  @Field(() => AdminWhereInput, { nullable: true })
  none?: AdminWhereInput
}

@InputType()
export class AdminRelationFilter {
  @Field(() => AdminWhereInput, { nullable: true })
  is?: AdminWhereInput
  @Field(() => AdminWhereInput, { nullable: true })
  isNot?: AdminWhereInput
}
