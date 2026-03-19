import { CreateVerificationInput } from './create-verification.input'
import { Field, InputType, Int, PartialType } from '@nestjs/graphql'
import { Verification } from '@prisma/client'
import { IsInt } from 'class-validator'

@InputType()
export class UpdateVerificationInput extends PartialType(
  CreateVerificationInput,
) {
  @IsInt()
  @Field(() => Int)
  garageId: Verification['garageId']
}
