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
import { CreateAddress } from './dtos/create.dto'
import { AddressQueryDto } from './dtos/query.dto'
import { UpdateAddress } from './dtos/update.dto'
import { AddressEntity } from './entity/address.entity'
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator'
import { GetUserType } from 'src/common/types'
import { checkRowLevelPermission } from 'src/common/auth/util'

@AllowAuthenticated()
@ApiBearerAuth()
@ApiTags('addresses')
@ApiUnauthorizedResponse({ description: 'Unauthorized - missing or invalid bearer token' })
@ApiForbiddenResponse({ description: 'Forbidden - insufficient permissions' })
@Controller('addresses')
export class AddressesController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an address', description: 'Create a new address for a garage. Requires manager authorization.' })
  @ApiBody({ type: CreateAddress, description: 'Address creation data' })
  @ApiCreatedResponse({ type: AddressEntity, description: 'Address created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @Post()
  async create(
    @Body() createAddressDto: CreateAddress,
    @GetUser() user: GetUserType,
  ) {
    const garage = await this.prisma.garage.findUnique({
      where: { id: createAddressDto.garageId },
      include: { Company: { include: { Managers: true } } },
    })
    checkRowLevelPermission(
      user,
      garage.Company.Managers.map((manager) => manager.uid),
    )
    return this.prisma.address.create({ data: createAddressDto })
  }

  @ApiOperation({ summary: 'List addresses', description: 'Retrieve all addresses with optional filtering and pagination' })
  @ApiQuery({ type: AddressQueryDto, description: 'Filtering and pagination options' })
  @ApiOkResponse({ type: [AddressEntity], description: 'List of addresses' })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: AddressQueryDto) {
    return this.prisma.address.findMany({
      ...(skip ? { skip: +skip } : null),
      ...(take ? { take: +take } : null),
      ...(sortBy ? { orderBy: { [sortBy]: order || 'asc' } } : null),
    })
  }

  @ApiOperation({ summary: 'Get address by ID', description: 'Retrieve a single address by its unique identifier' })
  @ApiParam({ name: 'id', description: 'Address ID', example: 1 })
  @ApiOkResponse({ type: AddressEntity, description: 'Address found' })
  @ApiNotFoundResponse({ description: 'Address not found' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.prisma.address.findUnique({ where: { id } })
  }

  @ApiOperation({ summary: 'Update address by ID', description: 'Update an existing address. Requires manager authorization.' })
  @ApiParam({ name: 'id', description: 'Address ID', example: 1 })
  @ApiBody({ type: UpdateAddress, description: 'Fields to update' })
  @ApiOkResponse({ type: AddressEntity, description: 'Address updated successfully' })
  @ApiNotFoundResponse({ description: 'Address not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateAddressDto: UpdateAddress,
    @GetUser() user: GetUserType,
  ) {
    const address = await this.prisma.address.findUnique({
      where: { id },
      include: {
        Garage: { include: { Company: { include: { Managers: true } } } },
      },
    })
    checkRowLevelPermission(
      user,
      address.Garage.Company.Managers.map((manager) => manager.uid),
    )
    return this.prisma.address.update({
      where: { id },
      data: updateAddressDto,
    })
  }

  @ApiOperation({ summary: 'Delete address by ID', description: 'Delete an existing address. Requires manager authorization.' })
  @ApiParam({ name: 'id', description: 'Address ID', example: 1 })
  @ApiOkResponse({ type: AddressEntity, description: 'Address deleted successfully' })
  @ApiNotFoundResponse({ description: 'Address not found' })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':id')
  async remove(@Param('id') id: number, @GetUser() user: GetUserType) {
    const address = await this.prisma.address.findUnique({
      where: { id },
      include: {
        Garage: { include: { Company: { include: { Managers: true } } } },
      },
    })
    checkRowLevelPermission(
      user,
      address.Garage.Company.Managers.map((manager) => manager.uid),
    )
    return this.prisma.address.delete({ where: { id } })
  }
}
