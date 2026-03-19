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
import { CreateBooking } from './dtos/create.dto'
import { BookingQueryDto } from './dtos/query.dto'
import { UpdateBooking } from './dtos/update.dto'
import { BookingEntity } from './entity/booking.entity'
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator'
import { GetUserType } from 'src/common/types'
import { checkRowLevelPermission } from 'src/common/auth/util'

@AllowAuthenticated()
@ApiBearerAuth()
@ApiTags('bookings')
@ApiUnauthorizedResponse({ description: 'Unauthorized - missing or invalid bearer token' })
@ApiForbiddenResponse({ description: 'Forbidden - insufficient permissions' })
@Controller('bookings')
export class BookingsController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a booking', description: 'Create a new parking booking. User must own the customer ID.' })
  @ApiBody({ type: CreateBooking, description: 'Booking creation data' })
  @ApiCreatedResponse({ type: BookingEntity, description: 'Booking created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid booking data' })
  @Post()
  create(
    @Body() createBookingDto: CreateBooking,
    @GetUser() user: GetUserType,
  ) {
    checkRowLevelPermission(user, createBookingDto.customerId)
    return this.prisma.booking.create({ data: createBookingDto })
  }

  @ApiOperation({ summary: 'List bookings', description: 'Retrieve all bookings with optional filtering and pagination' })
  @ApiQuery({ type: BookingQueryDto, description: 'Filtering and pagination options' })
  @ApiOkResponse({ type: [BookingEntity], description: 'List of bookings' })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: BookingQueryDto) {
    return this.prisma.booking.findMany({
      ...(skip ? { skip: +skip } : null),
      ...(take ? { take: +take } : null),
      ...(sortBy ? { orderBy: { [sortBy]: order || 'asc' } } : null),
    })
  }

  @ApiOperation({ summary: 'Get booking by ID', description: 'Retrieve a single booking by its unique identifier' })
  @ApiParam({ name: 'id', description: 'Booking ID', example: 1 })
  @ApiOkResponse({ type: BookingEntity, description: 'Booking found' })
  @ApiNotFoundResponse({ description: 'Booking not found' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.prisma.booking.findUnique({ where: { id } })
  }

  @ApiOperation({ summary: 'Update booking by ID', description: 'Update an existing booking. User must own the customer ID.' })
  @ApiParam({ name: 'id', description: 'Booking ID', example: 1 })
  @ApiBody({ type: UpdateBooking, description: 'Fields to update' })
  @ApiOkResponse({ type: BookingEntity, description: 'Booking updated successfully' })
  @ApiNotFoundResponse({ description: 'Booking not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateBookingDto: UpdateBooking,
    @GetUser() user: GetUserType,
  ) {
    const booking = await this.prisma.booking.findUnique({ where: { id } })
    checkRowLevelPermission(user, booking.customerId)
    return this.prisma.booking.update({
      where: { id },
      data: updateBookingDto,
    })
  }

  @ApiOperation({ summary: 'Delete booking by ID', description: 'Delete an existing booking. User must own the customer ID.' })
  @ApiParam({ name: 'id', description: 'Booking ID', example: 1 })
  @ApiOkResponse({ type: BookingEntity, description: 'Booking deleted successfully' })
  @ApiNotFoundResponse({ description: 'Booking not found' })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':id')
  async remove(@Param('id') id: number, @GetUser() user: GetUserType) {
    const booking = await this.prisma.booking.findUnique({ where: { id } })
    checkRowLevelPermission(user, booking.customerId)
    return this.prisma.booking.delete({ where: { id } })
  }
}
