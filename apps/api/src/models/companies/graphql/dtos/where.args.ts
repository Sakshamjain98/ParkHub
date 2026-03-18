import { Field, InputType, Int, PartialType } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import {
  DateTimeFilter,
  IntFilter,
  RestrictProperties,
  StringFilter,
} from 'src/common/dtos/common.input'
import { GarageListRelationFilter } from 'src/models/garages/graphql/dtos/where.args'
import { ManagerListRelationFilter } from 'src/models/managers/graphql/dtos/where.args'
import { ValetListRelationFilter } from 'src/models/valets/graphql/dtos/where.args'

@InputType()
export class CompanyWhereUniqueInput {
  @Field(() => Int)
  id: number
}

@InputType()
export class CompanyWhereInputStrict
  implements
    RestrictProperties<CompanyWhereInputStrict, Prisma.CompanyWhereInput>
{
  @Field(() => IntFilter, { nullable: true })
  id: IntFilter
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt: DateTimeFilter
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt: DateTimeFilter
  @Field(() => StringFilter, { nullable: true })
  displayName: StringFilter
  @Field(() => StringFilter, { nullable: true })
  description: StringFilter
  @Field(() => GarageListRelationFilter, { nullable: true })
  Garages: GarageListRelationFilter
  @Field(() => ManagerListRelationFilter, { nullable: true })
  Managers: ManagerListRelationFilter
  @Field(() => ValetListRelationFilter, { nullable: true })
  Valets: ValetListRelationFilter

  @Field(() => [CompanyWhereInputStrict], { nullable: true })
  AND: CompanyWhereInput[]
  @Field(() => [CompanyWhereInputStrict], { nullable: true })
  OR: CompanyWhereInput[]
  @Field(() => [CompanyWhereInputStrict], { nullable: true })
  NOT: CompanyWhereInput[]
}

@InputType()
export class CompanyWhereInput extends PartialType(CompanyWhereInputStrict) {}

@InputType()
export class CompanyListRelationFilter {
  @Field(() => CompanyWhereInput, { nullable: true })
  every?: CompanyWhereInput
  @Field(() => CompanyWhereInput, { nullable: true })
  some?: CompanyWhereInput
  @Field(() => CompanyWhereInput, { nullable: true })
  none?: CompanyWhereInput
}

@InputType()
export class CompanyRelationFilter {
  @Field(() => CompanyWhereInput, { nullable: true })
  is?: CompanyWhereInput
  @Field(() => CompanyWhereInput, { nullable: true })
  isNot?: CompanyWhereInput
}
