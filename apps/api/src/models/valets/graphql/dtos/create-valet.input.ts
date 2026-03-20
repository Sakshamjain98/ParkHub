import { Field, Float, InputType, OmitType } from '@nestjs/graphql'
import { IsOptional, IsString, IsNumber } from 'class-validator'
import { Valet } from '../entity/valet.entity'

@InputType()
export class CreateValetInput extends OmitType(
  Valet,
  ['createdAt', 'updatedAt'],
  InputType,
) {
  @IsString()
  @Field(() => String)
  uid: string

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  displayName: string

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  image: string

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  licenceID: string

  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  companyId: number
}
