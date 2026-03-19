import { ArgsType, Field, registerEnumType, PartialType } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { VerificationOrderByWithRelationInput } from './order-by.args'
import {
  VerificationWhereInput,
  VerificationWhereUniqueInput,
} from './where.args'
import { RestrictProperties } from 'src/common/dtos/common.input'

registerEnumType(Prisma.VerificationScalarFieldEnum, {
  name: 'VerificationScalarFieldEnum',
})

@ArgsType()
class FindManyVerificationArgsStrict
  implements
    RestrictProperties<
      FindManyVerificationArgsStrict,
      Omit<Prisma.VerificationFindManyArgs, 'include' | 'select'>
    >
{
  @Field(() => VerificationWhereInput, { nullable: true })
  where: VerificationWhereInput
  @Field(() => [VerificationOrderByWithRelationInput], { nullable: true })
  orderBy: VerificationOrderByWithRelationInput[]
  @Field(() => VerificationWhereUniqueInput, { nullable: true })
  cursor: VerificationWhereUniqueInput
  @Field({ nullable: true })
  take: number
  @Field({ nullable: true })
  skip: number
  @Field(() => [Prisma.VerificationScalarFieldEnum])
  distinct: Prisma.VerificationScalarFieldEnum[]
}

@ArgsType()
export class FindManyVerificationArgs extends PartialType(
  FindManyVerificationArgsStrict,
) {}

@ArgsType()
export class FindUniqueVerificationArgs {
  @Field(() => VerificationWhereUniqueInput)
  where: VerificationWhereUniqueInput
}
