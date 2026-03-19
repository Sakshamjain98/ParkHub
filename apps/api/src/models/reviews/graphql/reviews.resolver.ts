import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { ReviewsService } from './reviews.service'
import { Review } from './entity/review.entity'
import { FindManyReviewArgs, FindUniqueReviewArgs } from './dtos/find.args'
import { CreateReviewInput } from './dtos/create-review.input'
import { UpdateReviewInput } from './dtos/update-review.input'
import { checkRowLevelPermission } from 'src/common/auth/util'
import { GetUserType } from 'src/common/types'
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator'
import { PrismaService } from 'src/common/prisma/prisma.service'

@Resolver(() => Review)
export class ReviewsResolver {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly prisma: PrismaService,
  ) {}

  @AllowAuthenticated()
  @Mutation(() => Review, { description: 'Create a review for a garage.' })
  createReview(
    @Args('createReviewInput') args: CreateReviewInput,
    @GetUser() user: GetUserType,
  ) {
    checkRowLevelPermission(user, args.customerId)
    return this.reviewsService.create(args)
  }

  @AllowAuthenticated()
  @Query(() => [Review], {
    name: 'reviews',
    description: 'List reviews with optional filtering and pagination.',
  })
  findAll(@Args() args: FindManyReviewArgs) {
    return this.reviewsService.findAll(args)
  }

  @AllowAuthenticated()
  @Query(() => Review, {
    name: 'review',
    description: 'Get a single review by unique criteria.',
  })
  findOne(@Args() args: FindUniqueReviewArgs) {
    return this.reviewsService.findOne(args)
  }

  @AllowAuthenticated()
  @Mutation(() => Review, { description: 'Update an existing review.' })
  async updateReview(
    @Args('updateReviewInput') args: UpdateReviewInput,
    @GetUser() user: GetUserType,
  ) {
    const review = await this.prisma.review.findUnique({
      where: { id: args.id },
    })
    checkRowLevelPermission(user, review.customerId)
    return this.reviewsService.update(args)
  }

  @AllowAuthenticated()
  @Mutation(() => Review, { description: 'Delete an existing review.' })
  async removeReview(
    @Args() args: FindUniqueReviewArgs,
    @GetUser() user: GetUserType,
  ) {
    const review = await this.prisma.review.findUnique(args)
    checkRowLevelPermission(user, review.customerId)
    return this.reviewsService.remove(args)
  }
}
