import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { VerificationsService } from './verifications.service'
import { Verification } from './entity/verification.entity'
import {
  FindManyVerificationArgs,
  FindUniqueVerificationArgs,
} from './dtos/find.args'
import { CreateVerificationInput } from './dtos/create-verification.input'
import { UpdateVerificationInput } from './dtos/update-verification.input'
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { GetUserType } from 'src/common/types'
import { VerificationWhereUniqueInput } from './dtos/where.args'

@Resolver(() => Verification)
export class VerificationsResolver {
  constructor(
    private readonly verificationsService: VerificationsService,
    private readonly prisma: PrismaService,
  ) {}

  @AllowAuthenticated('admin')
  @Mutation(() => Verification, { description: 'Create a verification record.' })
  createVerification(
    @Args('createVerificationInput') args: CreateVerificationInput,
    @GetUser() user: GetUserType,
  ) {
    return this.verificationsService.create(args, user.uid)
  }

  @AllowAuthenticated('admin')
  @Query(() => [Verification], {
    name: 'verifications',
    description: 'List verification records with optional filtering and pagination.',
  })
  findAll(@Args() args: FindManyVerificationArgs) {
    return this.verificationsService.findAll(args)
  }

  @AllowAuthenticated('admin')
  @Query(() => Verification, {
    name: 'verification',
    description: 'Get a single verification record by unique criteria.',
  })
  findOne(@Args('where') where: VerificationWhereUniqueInput) {
    return this.verificationsService.findOne({ where })
  }

  @AllowAuthenticated('admin')
  @Mutation(() => Verification, { description: 'Update an existing verification record.' })
  async updateVerification(
    @Args('updateVerificationInput') args: UpdateVerificationInput,
  ) {
    return this.verificationsService.update(args)
  }

  @AllowAuthenticated('admin')
  @Mutation(() => Verification, { description: 'Delete an existing verification record.' })
  async removeVerification(
    @Args('where') where: VerificationWhereUniqueInput,
  ) {
    const args = { where }
    return this.verificationsService.remove(args)
  }
}
