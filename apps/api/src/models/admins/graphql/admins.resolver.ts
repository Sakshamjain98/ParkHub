import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql'
import { AdminsService } from './admins.service'
import { Admin } from './entity/admin.entity'
import { FindManyAdminArgs, FindUniqueAdminArgs } from './dtos/find.args'
import { CreateAdminInput } from './dtos/create-admin.input'
import { UpdateAdminInput } from './dtos/update-admin.input'
import { checkRowLevelPermission } from 'src/common/auth/util'
import { GetUserType } from 'src/common/types'
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { User } from 'src/models/users/graphql/entity/user.entity'
import { Verification } from 'src/models/verifications/graphql/entity/verification.entity'
import { AdminWhereInput, AdminWhereUniqueInput } from './dtos/where.args'

@AllowAuthenticated('admin')
@Resolver(() => Admin)
export class AdminsResolver {
  constructor(
    private readonly adminsService: AdminsService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation(() => Admin, { description: 'Create an admin profile.' })
  createAdmin(
    @Args('createAdminInput') args: CreateAdminInput,
    @GetUser() user: GetUserType,
  ) {
    checkRowLevelPermission(user, args.uid)
    return this.adminsService.create(args)
  }

  @Query(() => [Admin], {
    name: 'admins',
    description: 'List admins with optional filtering and pagination.',
  })
  findAll(@Args() args: FindManyAdminArgs) {
    return this.adminsService.findAll(args)
  }

  @Query(() => Admin, {
    name: 'admin',
    description: 'Get a single admin by unique criteria.',
  })
  findOne(@Args('where') where: AdminWhereUniqueInput) {
    return this.adminsService.findOne({ where })
  }

  @AllowAuthenticated()
  @Query(() => Admin, {
    name: 'adminMe',
    description: 'Get profile of the authenticated admin.',
  })
  adminMe(@GetUser() user: GetUserType) {
    return this.adminsService.findOne({ where: { uid: user.uid } })
  }

  @AllowAuthenticated()
  @Mutation(() => Admin, { description: 'Update an existing admin.' })
  async updateAdmin(
    @Args('updateAdminInput') args: UpdateAdminInput,
    @GetUser() user: GetUserType,
  ) {
    const admin = await this.prisma.admin.findUnique({
      where: { uid: args.uid },
    })
    checkRowLevelPermission(user, admin.uid)
    return this.adminsService.update(args)
  }

  @Mutation(() => Admin, { description: 'Delete an existing admin.' })
  async removeAdmin(
    @Args('where') where: AdminWhereUniqueInput,
    @GetUser() user: GetUserType,
  ) {
    const args = { where }
    const admin = await this.prisma.admin.findUnique(args)
    checkRowLevelPermission(user, admin.uid)
    return this.adminsService.remove(args)
  }

  @ResolveField(() => User, { nullable: true })
  user(@Parent() admin: Admin) {
    return this.prisma.user.findUnique({ where: { uid: admin.uid } })
  }

  @ResolveField(() => [Verification])
  verifications(@Parent() parent: Admin) {
    return this.prisma.verification.findMany({
      where: { adminId: parent.uid },
    })
  }

  @ResolveField(() => Number)
  async verificationsCount(@Parent() parent: Admin) {
    return this.prisma.verification.count({
      where: { adminId: parent.uid },
    })
  }

  @Query(() => Number, {
    name: 'adminsCount',
    description: 'Get total count of admins by optional filter.',
  })
  async adminsCount(
    @Args('where', { nullable: true })
    where: AdminWhereInput,
  ) {
    return this.prisma.admin.count({
      where,
    })
  }
}
