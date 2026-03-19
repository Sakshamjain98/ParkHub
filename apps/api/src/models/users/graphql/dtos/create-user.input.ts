import {
  Field,
  InputType,
  ObjectType,
  PickType,
  registerEnumType,
} from '@nestjs/graphql'
import { User } from '../entity/user.entity'
import { AuthProviderType } from '@prisma/client'
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'

registerEnumType(AuthProviderType, {
  name: 'AuthProviderType',
})

@InputType()
export class RegisterWithProviderInput extends PickType(
  User,
  ['uid', 'name', 'image'],
  InputType,
) {
  @IsString()
  @Field()
  uid: string

  @IsString()
  @Field({ nullable: true })
  name: string

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  image: string

  @IsEnum(AuthProviderType)
  @Field(() => AuthProviderType)
  type: AuthProviderType
}

@InputType()
export class RegisterWithCredentialsInput extends PickType(
  User,
  ['name', 'image'],
  InputType,
) {
  @IsString()
  @Field({ nullable: true })
  name: string

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  image: string

  @IsEmail()
  @Field()
  email: string

  @IsString()
  @MinLength(6)
  @Field()
  password: string
}

@InputType()
export class LoginInput extends PickType(RegisterWithCredentialsInput, [
  'email',
  'password',
]) {}

@ObjectType()
export class LoginOutput {
  @Field()
  token: string
  @Field(() => User)
  user: User
}
