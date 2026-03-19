import { Admin } from '@prisma/client'
import { RestrictProperties } from 'src/common/dtos/common.input'
import { ApiProperty } from '@nestjs/swagger'

export class AdminEntity implements RestrictProperties<AdminEntity, Admin> {
  @ApiProperty({
    description: 'Unique identifier (UID) of the admin user',
    example: '550e8400-e29b-41d4-a716-446655440003',
  })
  uid: string

  @ApiProperty({
    description: 'Admin creation timestamp',
    example: '2024-03-19T10:30:45.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-03-19T15:45:20.000Z',
  })
  updatedAt: Date
}
