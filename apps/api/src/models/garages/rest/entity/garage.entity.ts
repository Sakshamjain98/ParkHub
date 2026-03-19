import { Garage } from '@prisma/client'
import { IsDate, IsString, IsInt, IsOptional } from 'class-validator'
import { RestrictProperties } from 'src/common/dtos/common.input'
import { ApiProperty } from '@nestjs/swagger'

export class GarageEntity implements RestrictProperties<GarageEntity, Garage> {
  @ApiProperty({
    description: 'Unique identifier for the garage',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Garage creation timestamp',
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
    description: 'Display name of the garage',
    example: 'Downtown Parking',
    required: false,
  })
  displayName: string

  @IsOptional()
  @ApiProperty({
    description: 'Detailed description of garage amenities',
    example: 'Climate-controlled, 24/7 surveillance, EV charging stations',
    required: false,
  })
  description: string

  @ApiProperty({
    description: 'Array of image URLs for the garage',
    example: ['https://cdn.example.com/garage/img1.jpg', 'https://cdn.example.com/garage/img2.jpg'],
    isArray: true,
  })
  images: string[]

  @ApiProperty({
    description: 'ID of the company that owns this garage',
    example: 1,
  })
  companyId: number
}
