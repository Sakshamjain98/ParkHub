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
import { CreateGarage } from './dtos/create.dto'
import { GarageQueryDto } from './dtos/query.dto'
import { UpdateGarage } from './dtos/update.dto'
import { GarageEntity } from './entity/garage.entity'
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator'
import { GetUserType } from 'src/common/types'
import { checkRowLevelPermission } from 'src/common/auth/util'

@AllowAuthenticated()
@ApiBearerAuth()
@ApiTags('garages')
@ApiUnauthorizedResponse({ description: 'Unauthorized - missing or invalid bearer token' })
@ApiForbiddenResponse({ description: 'Forbidden - must be a company manager' })
@Controller('garages')
export class GaragesController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a garage', description: 'Create a new parking garage. Must be a manager of the company.' })
  @ApiBody({ type: CreateGarage, description: 'Garage creation data' })
  @ApiCreatedResponse({ type: GarageEntity, description: 'Garage created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid garage data' })
  @Post()
  async create(
    @Body() createGarageDto: CreateGarage,
    @GetUser() user: GetUserType,
  ) {
    const company = await this.prisma.company.findUnique({
      where: { id: createGarageDto.companyId },
      include: { Managers: true },
    })
    checkRowLevelPermission(
      user,
      company.Managers.map((manager) => manager.uid),
    )
    return this.prisma.garage.create({ data: createGarageDto })
  }

  @ApiOperation({ summary: 'List garages', description: 'Retrieve all garages with optional filtering and pagination' })
  @ApiQuery({ type: GarageQueryDto, description: 'Filtering and pagination options' })
  @ApiOkResponse({ type: [GarageEntity], description: 'List of garages' })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: GarageQueryDto) {
    return this.prisma.garage.findMany({
      ...(skip ? { skip: +skip } : null),
      ...(take ? { take: +take } : null),
      ...(sortBy ? { orderBy: { [sortBy]: order || 'asc' } } : null),
    })
  }

  @ApiOperation({ summary: 'Get garage by ID', description: 'Retrieve a single garage by its unique identifier' })
  @ApiParam({ name: 'id', description: 'Garage ID', example: 1 })
  @ApiOkResponse({ type: GarageEntity, description: 'Garage found' })
  @ApiNotFoundResponse({ description: 'Garage not found' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.prisma.garage.findUnique({ where: { id } })
  }

  @ApiOperation({ summary: 'Update garage by ID', description: 'Update an existing garage. Must be a manager of the company.' })
  @ApiParam({ name: 'id', description: 'Garage ID', example: 1 })
  @ApiBody({ type: UpdateGarage, description: 'Fields to update' })
  @ApiOkResponse({ type: GarageEntity, description: 'Garage updated successfully' })
  @ApiNotFoundResponse({ description: 'Garage not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateGarageDto: UpdateGarage,
    @GetUser() user: GetUserType,
  ) {
    const garage = await this.prisma.garage.findUnique({
      where: { id },
      include: { Company: { include: { Managers: true } } },
    })
    checkRowLevelPermission(
      user,
      garage.Company.Managers.map((manager) => manager.uid),
    )
    return this.prisma.garage.update({
      where: { id },
      data: updateGarageDto,
    })
  }

  @ApiOperation({ summary: 'Delete garage by ID', description: 'Delete an existing garage. Must be a manager of the company.' })
  @ApiParam({ name: 'id', description: 'Garage ID', example: 1 })
  @ApiOkResponse({ type: GarageEntity, description: 'Garage deleted successfully' })
  @ApiNotFoundResponse({ description: 'Garage not found' })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':id')
  async remove(@Param('id') id: number, @GetUser() user: GetUserType) {
    const garage = await this.prisma.garage.findUnique({
      where: { id },
      include: { Company: { include: { Managers: true } } },
    })
    checkRowLevelPermission(
      user,
      garage.Company.Managers.map((manager) => manager.uid),
    )
    return this.prisma.garage.delete({ where: { id } })
  }
}
