import { Field, Float, InputType, ObjectType, PickType } from '@nestjs/graphql'
import { FindManyGarageArgs } from './find.args'
import { Slot } from 'src/models/slots/graphql/entity/slot.entity'
import { IsString } from 'class-validator'

@InputType()
export class DateFilterInput {
  @IsString()
  @Field()
  start: string
  @IsString()
  @Field()
  end: string
}

@InputType()
export class GarageFilter extends PickType(
  FindManyGarageArgs,
  ['where', 'orderBy', 'skip', 'take'],
  InputType,
) {}

@ObjectType()
export class MinimalSlotGroupBy extends PickType(Slot, [
  'type',
  'pricePerHour',
]) {
  @Field(() => Float)
  count: number
}
