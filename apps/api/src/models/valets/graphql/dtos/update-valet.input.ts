import { CreateValetInput } from './create-valet.input'
import { Field, InputType, PartialType } from '@nestjs/graphql'
import { Valet } from '@prisma/client'
import { IsString } from 'class-validator'

@InputType()
export class UpdateValetInput extends PartialType(CreateValetInput) {
  @IsString()
  @Field(() => String)
  uid: Valet['uid']
}
