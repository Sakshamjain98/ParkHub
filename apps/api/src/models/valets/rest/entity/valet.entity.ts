import { Valet } from '@prisma/client'
import { IsDate, IsString, IsInt, IsOptional } from 'class-validator'
import { RestrictProperties } from 'src/common/dtos/common.input'
import { ApiProperty } from '@nestjs/swagger'

export class ValetEntity implements RestrictProperties<ValetEntity, Valet> {
  @ApiProperty({
    description: 'Unique identifier (UID) of the valet',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  uid: string

  @ApiProperty({
    description: 'Valet creation timestamp',
    example: '2024-03-19T10:30:45.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-03-19T15:45:20.000Z',
  })
  updatedAt: Date

  @ApiProperty({
    description: 'Display name of the valet',
    example: 'Mike Johnson',
  })
  displayName: string

  @IsOptional()
  @ApiProperty({
    description: 'Profile image URL of the valet',
    example: 'https://cdn.example.com/valets/550e8400.jpg',
    required: false,
  })
  image: string

  @ApiProperty({
    description: 'Driving license ID number',
    example: 'DL123456789',
  })
  licenceID: string

  @IsOptional()
  @ApiProperty({
    description: 'ID of the company the valet works for',
    example: 2,
    required: false,
  })
  companyId: number
}
