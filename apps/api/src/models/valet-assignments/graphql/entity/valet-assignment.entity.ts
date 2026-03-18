import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { ValetAssignment as ValetAssignmentType } from '@prisma/client'
import { RestrictProperties } from 'src/common/dtos/common.input'

@ObjectType()
export class ValetAssignment
  implements RestrictProperties<ValetAssignment, ValetAssignmentType>
{
  @Field(() => Int)
  bookingId: number
  @Field()
  createdAt: Date
  @Field()
  updatedAt: Date
  @Field(() => Float, { nullable: true })
  pickupLat: number
  @Field(() => Float, { nullable: true })
  pickupLng: number
  @Field({ nullable: true })
  returnLat: number
  @Field({ nullable: true })
  returnLng: number
  @Field({ nullable: true })
  pickupValetId: string
  @Field({ nullable: true })
  returnValetId: string
  // Todo Add below to make optional fields optional.
  // @Field({ nullable: true })
}
