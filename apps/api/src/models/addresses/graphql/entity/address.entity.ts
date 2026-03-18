import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { Address as AddressType } from '@prisma/client'
import { RestrictProperties } from 'src/common/dtos/common.input'

@ObjectType()
export class Address implements RestrictProperties<Address, AddressType> {
  @Field(() => Int)
  id: number
  @Field()
  createdAt: Date
  @Field()
  updatedAt: Date
  @Field({ nullable: true })
  address: string
  @Field(() => Float, { nullable: true })
  lat: number
  @Field(() => Float, { nullable: true })
  lng: number
  @Field({ nullable: true })
  garageId: number
  // Todo Add below to make optional fields optional.
  // @Field({ nullable: true })
}
