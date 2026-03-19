import { Field, InputType, Int } from '@nestjs/graphql'
import { IsBoolean, IsInt } from 'class-validator'

@InputType()
export class CreateVerificationInput {
  @IsBoolean()
  @Field(() => Boolean)
  verified: boolean

  @IsInt()
  @Field(() => Int)
  garageId: number
}
