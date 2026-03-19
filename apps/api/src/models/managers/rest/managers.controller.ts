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
import { CreateManager } from './dtos/create.dto'
import { ManagerQueryDto } from './dtos/query.dto'
import { UpdateManager } from './dtos/update.dto'
import { ManagerEntity } from './entity/manager.entity'
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator'
import { GetUserType } from 'src/common/types'
import { checkRowLevelPermission } from 'src/common/auth/util'

@AllowAuthenticated()
@ApiBearerAuth()
@ApiTags('managers')
@ApiUnauthorizedResponse({ description: 'Unauthorized - missing or invalid bearer token' })
@ApiForbiddenResponse({ description: 'Forbidden - insufficient permissions' })
@Controller('managers')
export class ManagersController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a manager', description: 'Create a new company manager. User must own the manager UID.' })
  @ApiBody({ type: CreateManager, description: 'Manager creation data' })
  @ApiCreatedResponse({ type: ManagerEntity, description: 'Manager created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid manager data' })
  @Post()
  create(
    @Body() createManagerDto: CreateManager,
    @GetUser() user: GetUserType,
  ) {
    checkRowLevelPermission(user, createManagerDto.uid)
    return this.prisma.manager.create({ data: createManagerDto })
  }

  @ApiOperation({ summary: 'List managers', description: 'Retrieve all managers with optional filtering and pagination' })
  @ApiQuery({ type: ManagerQueryDto, description: 'Filtering and pagination options' })
  @ApiOkResponse({ type: [ManagerEntity], description: 'List of managers' })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: ManagerQueryDto) {
    return this.prisma.manager.findMany({
      ...(skip ? { skip: +skip } : null),
      ...(take ? { take: +take } : null),
      ...(sortBy ? { orderBy: { [sortBy]: order || 'asc' } } : null),
    })
  }

  @ApiOperation({ summary: 'Get manager by UID', description: 'Retrieve a single manager by their unique identifier' })
  @ApiParam({ name: 'uid', description: 'Manager UID', example: '550e8400-e29b-41d4-a716-446655440004' })
  @ApiOkResponse({ type: ManagerEntity, description: 'Manager found' })
  @ApiNotFoundResponse({ description: 'Manager not found' })
  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.prisma.manager.findUnique({ where: { uid } })
  }

  @ApiOperation({ summary: 'Update manager by UID', description: 'Update an existing manager. User must own the UID.' })
  @ApiParam({ name: 'uid', description: 'Manager UID', example: '550e8400-e29b-41d4-a716-446655440004' })
  @ApiBody({ type: UpdateManager, description: 'Fields to update' })
  @ApiOkResponse({ type: ManagerEntity, description: 'Manager updated successfully' })
  @ApiNotFoundResponse({ description: 'Manager not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':uid')
  async update(
    @Param('uid') uid: string,
    @Body() updateManagerDto: UpdateManager,
    @GetUser() user: GetUserType,
  ) {
    const manager = await this.prisma.manager.findUnique({ where: { uid } })
    checkRowLevelPermission(user, manager.uid)
    return this.prisma.manager.update({
      where: { uid },
      data: updateManagerDto,
    })
  }

  @ApiOperation({ summary: 'Delete manager by UID', description: 'Delete an existing manager. User must own the UID.' })
  @ApiParam({ name: 'uid', description: 'Manager UID', example: '550e8400-e29b-41d4-a716-446655440004' })
  @ApiOkResponse({ type: ManagerEntity, description: 'Manager deleted successfully' })
  @ApiNotFoundResponse({ description: 'Manager not found' })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':uid')
  async remove(@Param('uid') uid: string, @GetUser() user: GetUserType) {
    const manager = await this.prisma.manager.findUnique({ where: { uid } })
    checkRowLevelPermission(user, manager.uid)
    return this.prisma.manager.delete({ where: { uid } })
  }
}
