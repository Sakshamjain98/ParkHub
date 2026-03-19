import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common'

import { PrismaService } from 'src/common/prisma/prisma.service'
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { CreateSlot } from './dtos/create.dto'
import { SlotQueryDto } from './dtos/query.dto'
import { UpdateSlot } from './dtos/update.dto'
import { SlotEntity } from './entity/slot.entity'
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator'
import { GetUserType } from 'src/common/types'
import { checkRowLevelPermission } from 'src/common/auth/util'

@AllowAuthenticated()
@ApiBearerAuth()
@ApiTags('slots')
@ApiUnauthorizedResponse({
  description: 'Unauthorized - missing or invalid bearer token',
})
@ApiForbiddenResponse({ description: 'Forbidden - must be a garage manager' })
@Controller('slots')
export class SlotsController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a slot',
    description:
      'Create a new parking slot. Must be a manager of the garage company.',
  })
  @ApiBody({ type: CreateSlot, description: 'Slot creation data' })
  @ApiCreatedResponse({
    type: SlotEntity,
    description: 'Slot created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid slot data' })
  @Post()
  async create(
    @Body() createSlotDto: CreateSlot,
    @GetUser() user: GetUserType,
  ) {
    const garage = await this.prisma.garage.findUnique({
      where: { id: createSlotDto.garageId },
      include: { Company: { include: { Managers: true } } },
    })
    checkRowLevelPermission(
      user,
      garage.Company.Managers.map((manager) => manager.uid),
    )
    return this.prisma.slot.create({ data: createSlotDto })
  }

  @ApiOperation({
    summary: 'List slots',
    description: 'Retrieve all slots with optional filtering and pagination',
  })
  @ApiQuery({
    type: SlotQueryDto,
    description: 'Filtering and pagination options',
  })
  @ApiOkResponse({ type: [SlotEntity], description: 'List of slots' })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: SlotQueryDto) {
    return this.prisma.slot.findMany({
      ...(skip ? { skip: +skip } : null),
      ...(take ? { take: +take } : null),
      ...(sortBy ? { orderBy: { [sortBy]: order || 'asc' } } : null),
    })
  }

  @ApiOperation({
    summary: 'Get slot by ID',
    description: 'Retrieve a single parking slot by its unique identifier',
  })
  @ApiParam({ name: 'id', description: 'Slot ID', example: 1 })
  @ApiOkResponse({ type: SlotEntity, description: 'Slot found' })
  @ApiNotFoundResponse({ description: 'Slot not found' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.prisma.slot.findUnique({ where: { id } })
  }

  @ApiOperation({
    summary: 'Update slot by ID',
    description:
      'Update an existing slot. Must be a manager of the garage company.',
  })
  @ApiParam({ name: 'id', description: 'Slot ID', example: 1 })
  @ApiBody({ type: UpdateSlot, description: 'Fields to update' })
  @ApiOkResponse({ type: SlotEntity, description: 'Slot updated successfully' })
  @ApiNotFoundResponse({ description: 'Slot not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateSlotDto: UpdateSlot,
    @GetUser() user: GetUserType,
  ) {
    const slot = await this.prisma.slot.findUnique({
      where: { id },
      include: {
        Garage: {
          include: {
            Company: {
              include: { Managers: true },
            },
          },
        },
      },
    })
    checkRowLevelPermission(
      user,
      slot.Garage.Company.Managers.map((man) => man.uid),
    )
    return this.prisma.slot.update({
      where: { id },
      data: updateSlotDto,
    })
  }

  @ApiOperation({
    summary: 'Delete slot by ID',
    description:
      'Delete an existing slot. Must be a manager of the garage company.',
  })
  @ApiParam({ name: 'id', description: 'Slot ID', example: 1 })
  @ApiOkResponse({ type: SlotEntity, description: 'Slot deleted successfully' })
  @ApiNotFoundResponse({ description: 'Slot not found' })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':id')
  async remove(@Param('id') id: number, @GetUser() user: GetUserType) {
    const slot = await this.prisma.slot.findUnique({
      where: { id },
      include: {
        Garage: {
          include: {
            Company: {
              include: { Managers: true },
            },
          },
        },
      },
    })
    checkRowLevelPermission(
      user,
      slot.Garage.Company.Managers.map((man) => man.uid),
    )
    return this.prisma.slot.delete({ where: { id } })
  }
}
