import { Field } from '@nestjs/graphql'
import { Verification } from '@prisma/client'
import { IsDate, IsString, IsInt } from 'class-validator'
import { RestrictProperties } from 'src/common/dtos/common.input'
import { ApiProperty } from '@nestjs/swagger'

export class VerificationEntity
  implements RestrictProperties<VerificationEntity, Verification>
{
  @ApiProperty({
    description: 'Verification creation timestamp',
    example: '2024-03-19T10:30:45.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-03-19T15:45:20.000Z',
  })
  updatedAt: Date

  @ApiProperty({
    description: 'Whether the garage has been verified',
    example: true,
  })
  verified: boolean

  @ApiProperty({
    description: 'UID of the admin who performed the verification',
    example: '550e8400-e29b-41d4-a716-446655440003',
  })
  adminId: string

  @ApiProperty({
    description: 'ID of the garage being verified',
    example: 1,
  })
  garageId: number
}
