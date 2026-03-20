import { Field, InputType, PickType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'
import { Company } from '../entity/company.entity'

@InputType()
export class CreateCompanyInput extends PickType(
  Company,
  ['displayName', 'description'],
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

  @IsString()
  @Field(() => String)
  managerId: string

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  managerName?: string
}
