import { Address } from '@prisma/client'
import { IsDate, IsString, IsInt, IsOptional } from 'class-validator'
import { RestrictProperties } from 'src/common/dtos/common.input'
import { ApiProperty } from '@nestjs/swagger'

export class AddressEntity
  implements RestrictProperties<AddressEntity, Address>
{
  @ApiProperty({
    description: 'Unique identifier for the address',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Address creation timestamp',
    example: '2024-03-19T10:30:45.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-03-19T15:45:20.000Z',
  })
  updatedAt: Date

  @ApiProperty({
    description: 'Full address text (street, city, postal code)',
    example: '123 Main St, Springfield, IL 62701',
  })
  address: string

  @ApiProperty({
    description: 'Latitude coordinate',
    example: 39.7817,
  })
  lat: number

  @ApiProperty({
    description: 'Longitude coordinate',
    example: -89.6501,
  })
  lng: number

  @IsOptional()
  @ApiProperty({
    description: 'Associated garage ID',
    example: 5,
    required: false,
  })
  garageId: number
}
