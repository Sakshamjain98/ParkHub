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
import { CreateCustomer } from './dtos/create.dto'
import { CustomerQueryDto } from './dtos/query.dto'
import { UpdateCustomer } from './dtos/update.dto'
import { CustomerEntity } from './entity/customer.entity'
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator'
import { GetUserType } from 'src/common/types'
import { checkRowLevelPermission } from 'src/common/auth/util'

@AllowAuthenticated()
@ApiBearerAuth()
@ApiTags('customers')
@ApiUnauthorizedResponse({ description: 'Unauthorized - missing or invalid bearer token' })
@ApiForbiddenResponse({ description: 'Forbidden - insufficient permissions' })
@Controller('customers')
export class CustomersController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a customer', description: 'Create a new customer profile. User must own the customer UID.' })
  @ApiBody({ type: CreateCustomer, description: 'Customer creation data' })
  @ApiCreatedResponse({ type: CustomerEntity, description: 'Customer created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid customer data' })
  @Post()
  create(
    @Body() createCustomerDto: CreateCustomer,
    @GetUser() user: GetUserType,
  ) {
    checkRowLevelPermission(user, createCustomerDto.uid)
    return this.prisma.customer.create({ data: createCustomerDto })
  }

  @ApiOperation({ summary: 'List customers', description: 'Retrieve all customers with optional filtering and pagination' })
  @ApiQuery({ type: CustomerQueryDto, description: 'Filtering and pagination options' })
  @ApiOkResponse({ type: [CustomerEntity], description: 'List of customers' })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: CustomerQueryDto) {
    return this.prisma.customer.findMany({
      ...(skip ? { skip: +skip } : null),
      ...(take ? { take: +take } : null),
      ...(sortBy ? { orderBy: { [sortBy]: order || 'asc' } } : null),
    })
  }

  @ApiOperation({ summary: 'Get customer by UID', description: 'Retrieve a single customer by their unique identifier' })
  @ApiParam({ name: 'uid', description: 'Customer UID', example: '550e8400-e29b-41d4-a716-446655440002' })
  @ApiOkResponse({ type: CustomerEntity, description: 'Customer found' })
  @ApiNotFoundResponse({ description: 'Customer not found' })
  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.prisma.customer.findUnique({ where: { uid } })
  }

  @ApiOperation({ summary: 'Update customer by UID', description: 'Update an existing customer profile. User must own the UID.' })
  @ApiParam({ name: 'uid', description: 'Customer UID', example: '550e8400-e29b-41d4-a716-446655440002' })
  @ApiBody({ type: UpdateCustomer, description: 'Fields to update' })
  @ApiOkResponse({ type: CustomerEntity, description: 'Customer updated successfully' })
  @ApiNotFoundResponse({ description: 'Customer not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':uid')
  async update(
    @Param('uid') uid: string,
    @Body() updateCustomerDto: UpdateCustomer,
    @GetUser() user: GetUserType,
  ) {
    const customer = await this.prisma.customer.findUnique({ where: { uid } })
    checkRowLevelPermission(user, customer.uid)
    return this.prisma.customer.update({
      where: { uid },
      data: updateCustomerDto,
    })
  }

  @ApiOperation({ summary: 'Delete customer by UID', description: 'Delete an existing customer profile. User must own the UID.' })
  @ApiParam({ name: 'uid', description: 'Customer UID', example: '550e8400-e29b-41d4-a716-446655440002' })
  @ApiOkResponse({ type: CustomerEntity, description: 'Customer deleted successfully' })
  @ApiNotFoundResponse({ description: 'Customer not found' })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':uid')
  async remove(@Param('uid') uid: string, @GetUser() user: GetUserType) {
    const customer = await this.prisma.customer.findUnique({ where: { uid } })
    checkRowLevelPermission(user, customer.uid)
    return this.prisma.customer.delete({ where: { uid } })
  }
}
