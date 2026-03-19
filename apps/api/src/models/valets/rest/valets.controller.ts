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
import { CreateValet } from './dtos/create.dto'
import { ValetQueryDto } from './dtos/query.dto'
import { UpdateValet } from './dtos/update.dto'
import { ValetEntity } from './entity/valet.entity'
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator'
import { GetUserType } from 'src/common/types'
import { checkRowLevelPermission } from 'src/common/auth/util'

@AllowAuthenticated()
@ApiBearerAuth()
@ApiTags('valets')
@ApiUnauthorizedResponse({ description: 'Unauthorized - missing or invalid bearer token' })
@ApiForbiddenResponse({ description: 'Forbidden - insufficient permissions' })
@Controller('valets')
export class ValetsController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a valet', description: 'Create a new valet profile. User must own the valet UID.' })
  @ApiBody({ type: CreateValet, description: 'Valet creation data' })
  @ApiCreatedResponse({ type: ValetEntity, description: 'Valet created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid valet data' })
  @Post()
  create(@Body() createValetDto: CreateValet, @GetUser() user: GetUserType) {
    checkRowLevelPermission(user, createValetDto.uid)
    return this.prisma.valet.create({ data: createValetDto })
  }

  @ApiOperation({ summary: 'List valets', description: 'Retrieve all valets with optional filtering and pagination' })
  @ApiQuery({ type: ValetQueryDto, description: 'Filtering and pagination options' })
  @ApiOkResponse({ type: [ValetEntity], description: 'List of valets' })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: ValetQueryDto) {
    return this.prisma.valet.findMany({
      ...(skip ? { skip: +skip } : null),
      ...(take ? { take: +take } : null),
      ...(sortBy ? { orderBy: { [sortBy]: order || 'asc' } } : null),
    })
  }

  @ApiOperation({ summary: 'Get valet by UID', description: 'Retrieve a single valet by their unique identifier' })
  @ApiParam({ name: 'uid', description: 'Valet UID', example: '550e8400-e29b-41d4-a716-446655440001' })
  @ApiOkResponse({ type: ValetEntity, description: 'Valet found' })
  @ApiNotFoundResponse({ description: 'Valet not found' })
  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.prisma.valet.findUnique({ where: { uid } })
  }

  @ApiOperation({ summary: 'Update valet by UID', description: 'Update an existing valet profile. User must own the UID.' })
  @ApiParam({ name: 'uid', description: 'Valet UID', example: '550e8400-e29b-41d4-a716-446655440001' })
  @ApiBody({ type: UpdateValet, description: 'Fields to update' })
  @ApiOkResponse({ type: ValetEntity, description: 'Valet updated successfully' })
  @ApiNotFoundResponse({ description: 'Valet not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':uid')
  async update(
    @Param('uid') uid: string,
    @Body() updateValetDto: UpdateValet,
    @GetUser() user: GetUserType,
  ) {
    const valet = await this.prisma.valet.findUnique({ where: { uid } })
    checkRowLevelPermission(user, valet.uid)
    return this.prisma.valet.update({
      where: { uid },
      data: updateValetDto,
    })
  }

  @ApiOperation({ summary: 'Delete valet by UID', description: 'Delete an existing valet profile. User must own the UID.' })
  @ApiParam({ name: 'uid', description: 'Valet UID', example: '550e8400-e29b-41d4-a716-446655440001' })
  @ApiOkResponse({ type: ValetEntity, description: 'Valet deleted successfully' })
  @ApiNotFoundResponse({ description: 'Valet not found' })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':uid')
  async remove(@Param('uid') uid: string, @GetUser() user: GetUserType) {
    const valet = await this.prisma.valet.findUnique({ where: { uid } })
    checkRowLevelPermission(user, valet.uid)
    return this.prisma.valet.delete({ where: { uid } })
  }
}
