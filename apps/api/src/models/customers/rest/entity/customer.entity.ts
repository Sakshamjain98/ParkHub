import { Customer } from '@prisma/client'
import { IsDate, IsString, IsInt, IsOptional } from 'class-validator'
import { RestrictProperties } from 'src/common/dtos/common.input'
import { ApiProperty } from '@nestjs/swagger'

export class CustomerEntity
  implements RestrictProperties<CustomerEntity, Customer>
{
  @ApiProperty({
    description: 'Unique identifier (UID) of the customer',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  uid: string

  @ApiProperty({
    description: 'Customer creation timestamp',
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
    description: 'Customer display name',
    example: 'Jane Smith',
    required: false,
  })
  displayName: string
}
