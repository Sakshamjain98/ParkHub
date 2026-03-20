import { Field, InputType, Int, OmitType } from '@nestjs/graphql'
import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator'
import { SlotType } from '@prisma/client'
import { Slot } from '../entity/slot.entity'

@InputType()
export class CreateSlotInput extends OmitType(
  Slot,
  ['createdAt', 'updatedAt', 'id'],
  InputType,
) {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  displayName: string

  @IsNumber()
  @Field(() => Number)
  pricePerHour: number

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  length: number

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  width: number

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  height: number

  @IsEnum(SlotType)
  @Field(() => SlotType)
  type: SlotType

  @IsInt()
  @Field(() => Int)
  garageId: number
}

@InputType()
export class CreateSlotInputWithoutGarageId extends OmitType(
  CreateSlotInput,
  ['garageId'],
  InputType,
) {
  @IsInt()
  @Field(() => Int)
  count: number
}
