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
import { CreateBookingTimeline } from './dtos/create.dto'
import { BookingTimelineQueryDto } from './dtos/query.dto'
import { UpdateBookingTimeline } from './dtos/update.dto'
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator'
import { GetUserType } from 'src/common/types'
import { checkRowLevelPermission } from 'src/common/auth/util'
import { BookingTimelineEntity } from './entity/booking-timeline.entity'

@AllowAuthenticated()
@ApiBearerAuth()
@ApiTags('booking-timelines')
@ApiUnauthorizedResponse({ description: 'Unauthorized - missing or invalid bearer token' })
@ApiForbiddenResponse({ description: 'Forbidden - must be assigned manager' })
@Controller('booking-timelines')
export class BookingTimelinesController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a booking timeline event', description: 'Create a status update for a booking.' })
  @ApiBody({ type: CreateBookingTimeline, description: 'Timeline event creation data' })
  @ApiCreatedResponse({ type: BookingTimelineEntity, description: 'Timeline event created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid event data' })
  @Post()
  create(
    @Body() createBookingTimelineDto: CreateBookingTimeline,
    @GetUser() user: GetUserType,
  ) {
    checkRowLevelPermission(user, createBookingTimelineDto.managerId)
    return this.prisma.bookingTimeline.create({
      data: createBookingTimelineDto,
    })
  }

  @ApiOperation({ summary: 'List booking timeline events', description: 'Retrieve all booking timeline events with optional filtering and pagination' })
  @ApiQuery({ type: BookingTimelineQueryDto, description: 'Filtering and pagination options' })
  @ApiOkResponse({ type: [BookingTimelineEntity], description: 'List of timeline events' })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: BookingTimelineQueryDto) {
    return this.prisma.bookingTimeline.findMany({
      ...(skip ? { skip: +skip } : null),
      ...(take ? { take: +take } : null),
      ...(sortBy ? { orderBy: { [sortBy]: order || 'asc' } } : null),
    })
  }

  @ApiOperation({ summary: 'Get booking timeline event by ID', description: 'Retrieve a single timeline event by its unique identifier' })
  @ApiParam({ name: 'id', description: 'Timeline event ID', example: 1 })
  @ApiOkResponse({ type: BookingTimelineEntity, description: 'Event found' })
  @ApiNotFoundResponse({ description: 'Event not found' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.prisma.bookingTimeline.findUnique({ where: { id } })
  }

  @ApiOperation({ summary: 'Update booking timeline event', description: 'Update an existing timeline event.' })
  @ApiParam({ name: 'id', description: 'Timeline event ID', example: 1 })
  @ApiBody({ type: UpdateBookingTimeline, description: 'Fields to update' })
  @ApiOkResponse({ type: BookingTimelineEntity, description: 'Event updated successfully' })
  @ApiNotFoundResponse({ description: 'Event not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateBookingTimelineDto: UpdateBookingTimeline,
    @GetUser() user: GetUserType,
  ) {
    const bookingTimeline = await this.prisma.bookingTimeline.findUnique({
      where: { id },
    })
    checkRowLevelPermission(user, bookingTimeline.managerId)
    return this.prisma.bookingTimeline.update({
      where: { id },
      data: updateBookingTimelineDto,
    })
  }

  @ApiOperation({ summary: 'Delete booking timeline event', description: 'Delete an existing timeline event.' })
  @ApiParam({ name: 'id', description: 'Timeline event ID', example: 1 })
  @ApiOkResponse({ type: BookingTimelineEntity, description: 'Event deleted successfully' })
  @ApiNotFoundResponse({ description: 'Event not found' })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':id')
  async remove(@Param('id') id: number, @GetUser() user: GetUserType) {
    const bookingTimeline = await this.prisma.bookingTimeline.findUnique({
      where: { id },
    })
    checkRowLevelPermission(user, bookingTimeline.managerId)
    return this.prisma.bookingTimeline.delete({ where: { id } })
  }
}
