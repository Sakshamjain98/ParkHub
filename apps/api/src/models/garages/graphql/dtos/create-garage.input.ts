import { Field, InputType, PickType } from '@nestjs/graphql'
import { IsArray, IsObject, IsOptional, IsString } from 'class-validator'
import { Garage } from '../entity/garage.entity'
import { CreateAddressInputWithoutGarageId } from 'src/models/addresses/graphql/dtos/create-address.input'
import { CreateSlotInputWithoutGarageId } from 'src/models/slots/graphql/dtos/create-slot.input'

@InputType()
export class CreateGarageInput extends PickType(
  Garage,
  ['description', 'displayName', 'images'],
  InputType,
) {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  displayName: string

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  description: string

  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  images: string[]

  @IsObject()
  @Field(() => CreateAddressInputWithoutGarageId)
  Address: CreateAddressInputWithoutGarageId

  @IsArray()
  @Field(() => [CreateSlotInputWithoutGarageId])
  Slots: CreateSlotInputWithoutGarageId[]
}
