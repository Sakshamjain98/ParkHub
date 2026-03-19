import { Manager } from '@prisma/client'
import { IsDate, IsString, IsInt, IsOptional } from 'class-validator'
import { RestrictProperties } from 'src/common/dtos/common.input'
import { ApiProperty } from '@nestjs/swagger'

export class ManagerEntity
  implements RestrictProperties<ManagerEntity, Manager>
{
  @ApiProperty({
    description: 'Unique identifier (UID) of the manager',
    example: '550e8400-e29b-41d4-a716-446655440004',
  })
  uid: string

  @ApiProperty({
    description: 'Manager creation timestamp',
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
    description: 'Manager display name',
    example: 'Robert Brown',
    required: false,
  })
  displayName: string

  @IsOptional()
  @ApiProperty({
    description: 'ID of the company this manager oversees',
    example: 1,
    required: false,
  })
  companyId: number
}
