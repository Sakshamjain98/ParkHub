import { Field, InputType, Int, PartialType } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import {
  DateTimeFilter,
  FloatFilter,
  IntFilter,
  RestrictProperties,
  StringFilter,
} from 'src/common/dtos/common.input'
import { GarageRelationFilter } from 'src/models/garages/graphql/dtos/where.args'

@InputType()
export class AddressWhereUniqueInput {
  @Field(() => Int)
  id: number
}

@InputType()
export class AddressWhereInputStrict
  implements
    RestrictProperties<AddressWhereInputStrict, Prisma.AddressWhereInput>
{
  @Field(() => IntFilter, { nullable: true })
  id: IntFilter
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt: DateTimeFilter
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt: DateTimeFilter
  @Field(() => StringFilter, { nullable: true })
  address: StringFilter
  @Field(() => FloatFilter, { nullable: true })
  lat: FloatFilter
  @Field(() => FloatFilter, { nullable: true })
  lng: FloatFilter
  @Field(() => IntFilter, { nullable: true })
  garageId: IntFilter
  @Field(() => GarageRelationFilter, { nullable: true })
  Garage: GarageRelationFilter

  @Field(() => [AddressWhereInputStrict], { nullable: true })
  AND: AddressWhereInput[]
  @Field(() => [AddressWhereInputStrict], { nullable: true })
  OR: AddressWhereInput[]
  @Field(() => [AddressWhereInputStrict], { nullable: true })
  NOT: AddressWhereInput[]
}

@InputType()
export class AddressWhereInput extends PartialType(AddressWhereInputStrict) {}

@InputType()
export class AddressListRelationFilter {
  @Field(() => AddressWhereInput, { nullable: true })
  every?: AddressWhereInput
  @Field(() => AddressWhereInput, { nullable: true })
  some?: AddressWhereInput
  @Field(() => AddressWhereInput, { nullable: true })
  none?: AddressWhereInput
}

@InputType()
export class AddressRelationFilter {
  @Field(() => AddressWhereInput, { nullable: true })
  is?: AddressWhereInput
  @Field(() => AddressWhereInput, { nullable: true })
  isNot?: AddressWhereInput
}
