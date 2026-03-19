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
import { CreateValetAssignment } from './dtos/create.dto'
import { ValetAssignmentQueryDto } from './dtos/query.dto'
import { UpdateValetAssignment } from './dtos/update.dto'
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator'
import { GetUserType } from 'src/common/types'
import { checkRowLevelPermission } from 'src/common/auth/util'
import { ValetAssignmentEntity } from './entity/valet-assignment.entity'

@AllowAuthenticated()
@ApiBearerAuth()
@ApiTags('valet-assignments')
@ApiUnauthorizedResponse({ description: 'Unauthorized - missing or invalid bearer token' })
@ApiForbiddenResponse({ description: 'Forbidden - must be assigned valet' })
@Controller('valet-assignments')
export class ValetAssignmentsController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a valet assignment', description: 'Assign valets to a booking for pickup and return.' })
  @ApiBody({ type: CreateValetAssignment, description: 'Assignment creation data' })
  @ApiCreatedResponse({ type: ValetAssignmentEntity, description: 'Assignment created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid assignment data' })
  @Post()
  create(
    @Body() createValetAssignmentDto: CreateValetAssignment,
    @GetUser() user: GetUserType,
  ) {
    checkRowLevelPermission(user, [
      createValetAssignmentDto.pickupValetId,
      createValetAssignmentDto.returnValetId,
    ])
    return this.prisma.valetAssignment.create({
      data: createValetAssignmentDto,
    })
  }

  @ApiOperation({ summary: 'List valet assignments', description: 'Retrieve all valet assignments with optional filtering and pagination' })
  @ApiQuery({ type: ValetAssignmentQueryDto, description: 'Filtering and pagination options' })
  @ApiOkResponse({ type: [ValetAssignmentEntity], description: 'List of assignments' })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: ValetAssignmentQueryDto) {
    return this.prisma.valetAssignment.findMany({
      ...(skip ? { skip: +skip } : null),
      ...(take ? { take: +take } : null),
      ...(sortBy ? { orderBy: { [sortBy]: order || 'asc' } } : null),
    })
  }

  @ApiOperation({ summary: 'Get valet assignment by booking ID', description: 'Retrieve a valet assignment by booking ID' })
  @ApiParam({ name: 'bookingId', description: 'Booking ID', example: 1 })
  @ApiOkResponse({ type: ValetAssignmentEntity, description: 'Assignment found' })
  @ApiNotFoundResponse({ description: 'Assignment not found' })
  @Get(':bookingId')
  findOne(@Param('bookingId') bookingId: number) {
    return this.prisma.valetAssignment.findUnique({ where: { bookingId } })
  }

  @ApiOperation({ summary: 'Update valet assignment', description: 'Update an existing valet assignment.' })
  @ApiParam({ name: 'bookingId', description: 'Booking ID', example: 1 })
  @ApiBody({ type: UpdateValetAssignment, description: 'Fields to update' })
  @ApiOkResponse({ type: ValetAssignmentEntity, description: 'Assignment updated successfully' })
  @ApiNotFoundResponse({ description: 'Assignment not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':bookingId')
  async update(
    @Param('bookingId') bookingId: number,
    @Body() updateValetAssignmentDto: UpdateValetAssignment,
    @GetUser() user: GetUserType,
  ) {
    const valetAssignment = await this.prisma.valetAssignment.findUnique({
      where: { bookingId },
    })
    checkRowLevelPermission(user, [
      valetAssignment.pickupValetId,
      valetAssignment.returnValetId,
    ])
    return this.prisma.valetAssignment.update({
      where: { bookingId },
      data: updateValetAssignmentDto,
    })
  }

  @ApiOperation({ summary: 'Delete valet assignment', description: 'Delete an existing valet assignment.' })
  @ApiParam({ name: 'bookingId', description: 'Booking ID', example: 1 })
  @ApiOkResponse({ type: ValetAssignmentEntity, description: 'Assignment deleted successfully' })
  @ApiNotFoundResponse({ description: 'Assignment not found' })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':bookingId')
  async remove(
    @Param('bookingId') bookingId: number,
    @GetUser() user: GetUserType,
  ) {
    const valetAssignment = await this.prisma.valetAssignment.findUnique({
      where: { bookingId },
    })
    checkRowLevelPermission(user, [
      valetAssignment.pickupValetId,
      valetAssignment.returnValetId,
    ])
    return this.prisma.valetAssignment.delete({ where: { bookingId } })
  }
}
