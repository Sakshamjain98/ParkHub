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
import { CreateUser } from './dtos/create.dto'
import { UserQueryDto } from './dtos/query.dto'
import { UpdateUser } from './dtos/update.dto'
import { UserEntity } from './entity/user.entity'
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator'
import { GetUserType } from 'src/common/types'
import { checkRowLevelPermission } from 'src/common/auth/util'

@AllowAuthenticated()
@ApiBearerAuth()
@ApiTags('users')
@ApiUnauthorizedResponse({
  description: 'Unauthorized - missing or invalid bearer token',
})
@ApiForbiddenResponse({ description: 'Forbidden - insufficient permissions' })
@Controller('users')
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a user',
    description:
      'Create a new user profile. The UID must match the authenticated user.',
  })
  @ApiBody({ type: CreateUser, description: 'User creation data' })
  @ApiCreatedResponse({
    type: UserEntity,
    description: 'User created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid user data' })
  @Post()
  create(@Body() createUserDto: CreateUser, @GetUser() user: GetUserType) {
    checkRowLevelPermission(user, createUserDto.uid)
    return this.prisma.user.create({ data: createUserDto })
  }

  @ApiOperation({
    summary: 'List users',
    description: 'Retrieve all users with optional filtering and pagination',
  })
  @ApiQuery({
    type: UserQueryDto,
    description: 'Filtering and pagination options',
  })
  @ApiOkResponse({ type: [UserEntity], description: 'List of users' })
  @Get()
  findAll(
    @Query() { skip, take, order, sortBy, search, searchBy }: UserQueryDto,
  ) {
    return this.prisma.user.findMany({
      ...(skip ? { skip: +skip } : null),
      ...(take ? { take: +take } : null),
      ...(sortBy ? { orderBy: { [sortBy]: order || 'asc' } } : null),
      ...(searchBy
        ? { where: { [searchBy]: { contains: search, mode: 'insensitive' } } }
        : null),
    })
  }

  @ApiOperation({
    summary: 'Get user by UID',
    description: 'Retrieve a single user by their unique identifier',
  })
  @ApiParam({
    name: 'uid',
    description: 'User UID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({ type: UserEntity, description: 'User found' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.prisma.user.findUnique({ where: { uid } })
  }

  @ApiOperation({
    summary: 'Update user by UID',
    description: 'Update an existing user profile. User must own the UID.',
  })
  @ApiParam({
    name: 'uid',
    description: 'User UID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: UpdateUser, description: 'Fields to update' })
  @ApiOkResponse({ type: UserEntity, description: 'User updated successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':uid')
  async update(
    @Param('uid') uid: string,
    @Body() updateUserDto: UpdateUser,
    @GetUser() user: GetUserType,
  ) {
    const userInfo = await this.prisma.user.findUnique({ where: { uid } })
    checkRowLevelPermission(user, userInfo.uid)
    return this.prisma.user.update({
      where: { uid },
      data: updateUserDto,
    })
  }

  @ApiOperation({
    summary: 'Delete user by UID',
    description: 'Delete an existing user profile. User must own the UID.',
  })
  @ApiParam({
    name: 'uid',
    description: 'User UID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({ type: UserEntity, description: 'User deleted successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':uid')
  async remove(@Param('uid') uid: string, @GetUser() user: GetUserType) {
    const userInfo = await this.prisma.user.findUnique({ where: { uid } })
    checkRowLevelPermission(user, userInfo.uid)
    return this.prisma.user.delete({ where: { uid } })
  }
}
