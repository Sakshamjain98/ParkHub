import { Field } from '@nestjs/graphql'
import { $Enums, Slot } from '@prisma/client'
import { IsDate, IsString, IsInt, IsOptional } from 'class-validator'
import { RestrictProperties } from 'src/common/dtos/common.input'
import { ApiProperty } from '@nestjs/swagger'

export class SlotEntity implements RestrictProperties<SlotEntity, Slot> {
  @ApiProperty({
    description: 'Unique identifier for the parking slot',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Slot creation timestamp',
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
    description: 'Display name of the slot',
    example: 'Slot A1 - Premium',
    required: false,
  })
  displayName: string

  @ApiProperty({
    description: 'Price per hour in currency units',
    example: 5.99,
  })
  pricePerHour: number

  @IsOptional()
  @ApiProperty({
    description: 'Slot length in meters',
    example: 5.5,
    required: false,
  })
  length: number

  @IsOptional()
  @ApiProperty({
    description: 'Slot width in meters',
    example: 2.5,
    required: false,
  })
  width: number

  @IsOptional()
  @ApiProperty({
    description: 'Slot height in meters',
    example: 2.0,
    required: false,
  })
  height: number

  @ApiProperty({
    description: 'Type of slot (COVERED, OPEN, etc.)',
    example: 'COVERED',
    enum: Object.values($Enums.SlotType),
  })
  type: $Enums.SlotType

  @ApiProperty({
    description: 'ID of the garage containing this slot',
    example: 1,
  })
  garageId: number
}
