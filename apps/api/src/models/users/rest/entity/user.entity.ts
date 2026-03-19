import { User } from '@prisma/client'
import { IsDate, IsString, IsInt, IsOptional } from 'class-validator'
import { RestrictProperties } from 'src/common/dtos/common.input'
import { ApiProperty } from '@nestjs/swagger'

export class UserEntity implements RestrictProperties<UserEntity, User> {
  @ApiProperty({
    description: 'Unique identifier (UID) of the user',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  uid: string

  @ApiProperty({
    description: 'User creation timestamp',
    example: '2024-03-19T10:30:45.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-03-19T15:45:20.000Z',
  })
  updatedAt: Date

  @IsOptional()
  @ApiProperty({
    description: 'User display name',
    example: 'John Doe',
    required: false,
  })
  name: string

  @IsOptional()
  @ApiProperty({
    description: 'User profile image URL',
    example: 'https://cdn.example.com/users/550e8400.jpg',
    required: false,
  })
  image: string
}
