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
import { CreateAdmin } from './dtos/create.dto'
import { AdminQueryDto } from './dtos/query.dto'
import { UpdateAdmin } from './dtos/update.dto'
import { AdminEntity } from './entity/admin.entity'
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator'
import { GetUserType } from 'src/common/types'
import { checkRowLevelPermission } from 'src/common/auth/util'

@AllowAuthenticated()
@ApiBearerAuth()
@ApiTags('admins')
@ApiUnauthorizedResponse({ description: 'Unauthorized - missing or invalid bearer token' })
@ApiForbiddenResponse({ description: 'Forbidden - must be an admin user' })
@Controller('admins')
export class AdminsController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an admin', description: 'Create a new admin user. Admin role required.' })
  @ApiBody({ type: CreateAdmin, description: 'Admin creation data' })
  @ApiCreatedResponse({ type: AdminEntity, description: 'Admin created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid admin data' })
  @Post()
  create(@Body() createAdminDto: CreateAdmin, @GetUser() user: GetUserType) {
    checkRowLevelPermission(user, createAdminDto.uid)
    return this.prisma.admin.create({ data: createAdminDto })
  }

  @ApiOperation({ summary: 'List admins', description: 'Retrieve all admin users with optional filtering and pagination' })
  @ApiQuery({ type: AdminQueryDto, description: 'Filtering and pagination options' })
  @ApiOkResponse({ type: [AdminEntity], description: 'List of admins' })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: AdminQueryDto) {
    return this.prisma.admin.findMany({
      ...(skip ? { skip: +skip } : null),
      ...(take ? { take: +take } : null),
      ...(sortBy ? { orderBy: { [sortBy]: order || 'asc' } } : null),
    })
  }

  @ApiOperation({ summary: 'Get admin by UID', description: 'Retrieve a single admin by their unique identifier' })
  @ApiParam({ name: 'uid', description: 'Admin UID', example: '550e8400-e29b-41d4-a716-446655440003' })
  @ApiOkResponse({ type: AdminEntity, description: 'Admin found' })
  @ApiNotFoundResponse({ description: 'Admin not found' })
  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.prisma.admin.findUnique({ where: { uid } })
  }

  @ApiOperation({ summary: 'Update admin by UID', description: 'Update an existing admin. Must be an admin user.' })
  @ApiParam({ name: 'uid', description: 'Admin UID', example: '550e8400-e29b-41d4-a716-446655440003' })
  @ApiBody({ type: UpdateAdmin, description: 'Fields to update' })
  @ApiOkResponse({ type: AdminEntity, description: 'Admin updated successfully' })
  @ApiNotFoundResponse({ description: 'Admin not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':uid')
  async update(
    @Param('uid') uid: string,
    @Body() updateAdminDto: UpdateAdmin,
    @GetUser() user: GetUserType,
  ) {
    const admin = await this.prisma.admin.findUnique({ where: { uid } })
    checkRowLevelPermission(user, admin.uid)
    return this.prisma.admin.update({
      where: { uid },
      data: updateAdminDto,
    })
  }

  @ApiOperation({ summary: 'Delete admin by UID', description: 'Delete an existing admin. Must be an admin user.' })
  @ApiParam({ name: 'uid', description: 'Admin UID', example: '550e8400-e29b-41d4-a716-446655440003' })
  @ApiOkResponse({ type: AdminEntity, description: 'Admin deleted successfully' })
  @ApiNotFoundResponse({ description: 'Admin not found' })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':uid')
  async remove(@Param('uid') uid: string, @GetUser() user: GetUserType) {
    const admin = await this.prisma.admin.findUnique({ where: { uid } })
    checkRowLevelPermission(user, admin.uid)
    return this.prisma.admin.delete({ where: { uid } })
  }
}
