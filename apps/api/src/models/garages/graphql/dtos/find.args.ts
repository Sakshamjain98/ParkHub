import {
  ArgsType,
  Field,
  Int,
  registerEnumType,
  PartialType,
} from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { GarageOrderByWithRelationInput } from './order-by.args'
import { GarageWhereInput, GarageWhereUniqueInput } from './where.args'
import { RestrictProperties } from 'src/common/dtos/common.input'

registerEnumType(Prisma.GarageScalarFieldEnum, {
  name: 'GarageScalarFieldEnum',
})

@ArgsType()
class FindManyGarageArgsStrict
  implements
    RestrictProperties<
      FindManyGarageArgsStrict,
      Omit<Prisma.GarageFindManyArgs, 'include' | 'select'>
    >
{
  @Field(() => GarageWhereInput, { nullable: true })
  where: GarageWhereInput
  @Field(() => [GarageOrderByWithRelationInput], { nullable: true })
  orderBy: GarageOrderByWithRelationInput[]
  cursor: GarageWhereUniqueInput
  @Field(() => Int, { nullable: true })
  take: number
  @Field(() => Int, { nullable: true })
  skip: number
  @Field(() => [Prisma.GarageScalarFieldEnum])
  distinct: Prisma.GarageScalarFieldEnum[]
}

@ArgsType()
export class FindManyGarageArgs extends PartialType(FindManyGarageArgsStrict) {}

@ArgsType()
export class FindUniqueGarageArgs {
  where: GarageWhereUniqueInput
}
