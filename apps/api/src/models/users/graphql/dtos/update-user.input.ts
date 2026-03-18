import { Field, InputType, PartialType } from '@nestjs/graphql'
import { User } from '../entity/user.entity'

@InputType()
export class UpdateUserInput extends PartialType(User) {
  @Field(() => String)
  uid: User['uid']
}
