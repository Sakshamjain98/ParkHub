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
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateVerification } from './dtos/create.dto'
import { VerificationQueryDto } from './dtos/query.dto'
import { UpdateVerification } from './dtos/update.dto'
import {
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
import { VerificationEntity } from './entity/verification.entity'
import { AllowAuthenticated } from 'src/common/auth/auth.decorator'

@AllowAuthenticated('admin')
@ApiBearerAuth()
@ApiTags('verifications')
@ApiUnauthorizedResponse({ description: 'Unauthorized - missing or invalid bearer token' })
@ApiForbiddenResponse({ description: 'Forbidden - only admins can manage verifications' })
@Controller('verifications')
export class VerificationsController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a verification', description: 'Create a new garage verification. Only admins can create verifications.' })
  @ApiBody({ type: CreateVerification, description: 'Verification creation data' })
  @ApiCreatedResponse({ type: VerificationEntity, description: 'Verification created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid verification data' })
  @Post()
  create(@Body() createVerificationDto: CreateVerification) {
    return this.prisma.verification.create({ data: createVerificationDto })
  }

  @ApiOperation({ summary: 'List verifications', description: 'Retrieve all garage verifications with optional filtering and pagination' })
  @ApiQuery({ type: VerificationQueryDto, description: 'Filtering and pagination options' })
  @ApiOkResponse({ type: [VerificationEntity], description: 'List of verifications' })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: VerificationQueryDto) {
    return this.prisma.verification.findMany({
      ...(skip ? { skip: +skip } : null),
      ...(take ? { take: +take } : null),
      ...(sortBy ? { orderBy: { [sortBy]: order || 'asc' } } : null),
    })
  }

  @ApiOperation({ summary: 'Get verification by garageId', description: 'Retrieve a single verification by its garage ID' })
  @ApiParam({ name: 'garageId', description: 'Garage ID', example: 1 })
  @ApiOkResponse({ type: VerificationEntity, description: 'Verification found' })
  @ApiNotFoundResponse({ description: 'Verification not found' })
  @Get(':garageId')
  findOne(@Param('garageId') garageId: number) {
    return this.prisma.verification.findUnique({ where: { garageId } })
  }

  @ApiOperation({ summary: 'Update verification by garageId', description: 'Update an existing verification. Only admins can update verifications.' })
  @ApiParam({ name: 'garageId', description: 'Garage ID', example: 1 })
  @ApiBody({ type: UpdateVerification, description: 'Fields to update' })
  @ApiOkResponse({ type: VerificationEntity, description: 'Verification updated successfully' })
  @ApiNotFoundResponse({ description: 'Verification not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @ApiBearerAuth()
  @AllowAuthenticated('admin')
  @Patch(':garageId')
  async update(
    @Param('garageId') garageId: number,
    @Body() updateVerificationDto: UpdateVerification,
  ) {
    return this.prisma.verification.update({
      where: { garageId },
      data: updateVerificationDto,
    })
  }

  @ApiOperation({ summary: 'Delete verification by garageId', description: 'Delete an existing verification. Only admins can delete verifications.' })
  @ApiParam({ name: 'garageId', description: 'Garage ID', example: 1 })
  @ApiOkResponse({ type: VerificationEntity, description: 'Verification deleted successfully' })
  @ApiNotFoundResponse({ description: 'Verification not found' })
  @ApiBearerAuth()
  @AllowAuthenticated('admin')
  @Delete(':garageId')
  async remove(@Param('garageId') garageId: number) {
    return this.prisma.verification.delete({ where: { garageId } })
  }
}
