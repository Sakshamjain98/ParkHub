import { Company } from '@prisma/client'
import { IsDate, IsString, IsInt, IsOptional } from 'class-validator'
import { RestrictProperties } from 'src/common/dtos/common.input'
import { ApiProperty } from '@nestjs/swagger'

export class CompanyEntity
  implements RestrictProperties<CompanyEntity, Company>
{
  @ApiProperty({
    description: 'Unique identifier for the company',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Company creation timestamp',
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
    description: 'Display name of the company',
    example: 'Elite Parking Solutions',
    required: false,
  })
  displayName: string

  @IsOptional()
  @ApiProperty({
    description: 'Detailed description of the company',
    example: 'Premier underground parking facility with 24/7 security',
    required: false,
  })
  description: string
}
