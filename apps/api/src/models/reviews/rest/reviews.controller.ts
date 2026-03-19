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
import { CreateReview } from './dtos/create.dto'
import { ReviewQueryDto } from './dtos/query.dto'
import { UpdateReview } from './dtos/update.dto'
import { ReviewEntity } from './entity/review.entity'
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator'
import { GetUserType } from 'src/common/types'
import { checkRowLevelPermission } from 'src/common/auth/util'

@AllowAuthenticated()
@ApiBearerAuth()
@ApiTags('reviews')
@ApiUnauthorizedResponse({ description: 'Unauthorized - missing or invalid bearer token' })
@ApiForbiddenResponse({ description: 'Forbidden - insufficient permissions' })
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a review', description: 'Create a new garage review. User must own the customer ID.' })
  @ApiBody({ type: CreateReview, description: 'Review creation data' })
  @ApiCreatedResponse({ type: ReviewEntity, description: 'Review created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid review data' })
  @Post()
  create(@Body() createReviewDto: CreateReview, @GetUser() user: GetUserType) {
    checkRowLevelPermission(user, createReviewDto.customerId)
    return this.prisma.review.create({ data: createReviewDto })
  }

  @ApiOperation({ summary: 'List reviews', description: 'Retrieve all reviews with optional filtering and pagination' })
  @ApiQuery({ type: ReviewQueryDto, description: 'Filtering and pagination options' })
  @ApiOkResponse({ type: [ReviewEntity], description: 'List of reviews' })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: ReviewQueryDto) {
    return this.prisma.review.findMany({
      ...(skip ? { skip: +skip } : null),
      ...(take ? { take: +take } : null),
      ...(sortBy ? { orderBy: { [sortBy]: order || 'asc' } } : null),
    })
  }

  @ApiOperation({ summary: 'Get review by ID', description: 'Retrieve a single review by its unique identifier' })
  @ApiParam({ name: 'id', description: 'Review ID', example: 1 })
  @ApiOkResponse({ type: ReviewEntity, description: 'Review found' })
  @ApiNotFoundResponse({ description: 'Review not found' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.prisma.review.findUnique({ where: { id } })
  }

  @ApiOperation({ summary: 'Update review by ID', description: 'Update an existing review. User must own the customer ID.' })
  @ApiParam({ name: 'id', description: 'Review ID', example: 1 })
  @ApiBody({ type: UpdateReview, description: 'Fields to update' })
  @ApiOkResponse({ type: ReviewEntity, description: 'Review updated successfully' })
  @ApiNotFoundResponse({ description: 'Review not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateReviewDto: UpdateReview,
    @GetUser() user: GetUserType,
  ) {
    const review = await this.prisma.review.findUnique({ where: { id } })
    checkRowLevelPermission(user, review.customerId)
    return this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
    })
  }

  @ApiOperation({ summary: 'Delete review by ID', description: 'Delete an existing review. User must own the customer ID.' })
  @ApiParam({ name: 'id', description: 'Review ID', example: 1 })
  @ApiOkResponse({ type: ReviewEntity, description: 'Review deleted successfully' })
  @ApiNotFoundResponse({ description: 'Review not found' })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':id')
  async remove(@Param('id') id: number, @GetUser() user: GetUserType) {
    const review = await this.prisma.review.findUnique({ where: { id } })
    checkRowLevelPermission(user, review.customerId)
    return this.prisma.review.delete({ where: { id } })
  }
}
