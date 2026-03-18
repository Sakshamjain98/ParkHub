import { Field, InputType, PartialType } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import {
  DateTimeFilter,
  RestrictProperties,
  StringFilter,
} from 'src/common/dtos/common.input'
import { CustomerRelationFilter } from 'src/models/customers/graphql/dtos/where.args'
import { ManagerRelationFilter } from 'src/models/managers/graphql/dtos/where.args'
import { ValetRelationFilter } from 'src/models/valets/graphql/dtos/where.args'

@InputType()
export class UserWhereUniqueInput {
  @Field(() => String)
  uid: string
}

@InputType()
export class UserWhereInputStrict
  implements
    RestrictProperties<
      UserWhereInputStrict,
      Omit<
        Prisma.UserWhereInput,
        'Credentials' | 'AuthProvider' | 'Admin' | 'image'
      >
    >
{
  @Field(() => CustomerRelationFilter, { nullable: true })
  Customer: CustomerRelationFilter
  @Field(() => ManagerRelationFilter, { nullable: true })
  Manager: ManagerRelationFilter
  @Field(() => ValetRelationFilter, { nullable: true })
  Valet: ValetRelationFilter
  @Field(() => StringFilter, { nullable: true })
  uid: StringFilter
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt: DateTimeFilter
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt: DateTimeFilter
  @Field(() => StringFilter, { nullable: true })
  name: StringFilter

  @Field(() => [UserWhereInputStrict], { nullable: true })
  AND: UserWhereInput[]
  @Field(() => [UserWhereInputStrict], { nullable: true })
  OR: UserWhereInput[]
  @Field(() => [UserWhereInputStrict], { nullable: true })
  NOT: UserWhereInput[]
}

@InputType()
export class UserWhereInput extends PartialType(UserWhereInputStrict) {}

@InputType()
export class UserListRelationFilter {
  @Field(() => UserWhereInput, { nullable: true })
  every?: UserWhereInput
  @Field(() => UserWhereInput, { nullable: true })
  some?: UserWhereInput
  @Field(() => UserWhereInput, { nullable: true })
  none?: UserWhereInput
}

@InputType()
export class UserRelationFilter {
  @Field(() => UserWhereInput, { nullable: true })
  is?: UserWhereInput
  @Field(() => UserWhereInput, { nullable: true })
  isNot?: UserWhereInput
}
