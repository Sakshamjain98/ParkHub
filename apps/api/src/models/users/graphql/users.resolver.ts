import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql'
import { UsersService } from './users.service'
import { AuthProvider, User } from './entity/user.entity'
import { FindManyUserArgs, FindUniqueUserArgs } from './dtos/find.args'
import {
  LoginInput,
  LoginOutput,
  RegisterWithCredentialsInput,
  RegisterWithProviderInput,
} from './dtos/create-user.input'
import { UpdateUserInput } from './dtos/update-user.input'
import { checkRowLevelPermission } from 'src/common/auth/util'
import { GetUserType } from 'src/common/types'
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { Admin } from 'src/models/admins/graphql/entity/admin.entity'
import { Manager } from 'src/models/managers/graphql/entity/manager.entity'
import { Valet } from 'src/models/valets/graphql/entity/valet.entity'
import { Customer } from 'src/models/customers/graphql/entity/customer.entity'

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation(() => User, {
    description: 'Register a new user with email and password.',
  })
  async registerWithCredentials(
    @Args('registerWithCredentialsInput')
    args: RegisterWithCredentialsInput,
    @Context()
    context: { req?: { headers?: Record<string, string | string[]> } },
  ) {
    const originHeader = context?.req?.headers?.origin
    const refererHeader = context?.req?.headers?.referer
    const hostHeader = context?.req?.headers?.host

    const origin = Array.isArray(originHeader)
      ? originHeader.join(' ')
      : originHeader || ''
    const referer = Array.isArray(refererHeader)
      ? refererHeader.join(' ')
      : refererHeader || ''
    const host = Array.isArray(hostHeader)
      ? hostHeader.join(' ')
      : hostHeader || ''

    const adminRequestSource = `${origin} ${referer} ${host}`
    const assignAdmin =
      adminRequestSource.includes('localhost:3004') ||
      adminRequestSource.includes('web-admin')

    return this.usersService.registerWithCredentials(args, { assignAdmin })
  }

  @Mutation(() => User, {
    description: 'Register a new user using an external auth provider.',
  })
  async registerWithProvider(
    @Args('registerWithProviderInput') args: RegisterWithProviderInput,
  ) {
    return this.usersService.registerWithProvider(args)
  }

  @Mutation(() => LoginOutput, {
    description: 'Authenticate a user and return an access token.',
  })
  async login(@Args('loginInput') args: LoginInput) {
    return this.usersService.login(args)
  }

  @AllowAuthenticated()
  @Query(() => User, {
    description: 'Get the currently authenticated user profile.',
  })
  whoami(@GetUser() user: GetUserType) {
    return this.usersService.findOne({ where: { uid: user.uid } })
  }

  @AllowAuthenticated()
  @Query(() => [User], {
    name: 'users',
    description: 'List users with optional filtering and pagination.',
  })
  findAll(@Args() args: FindManyUserArgs) {
    return this.usersService.findAll(args)
  }

  @AllowAuthenticated()
  @Query(() => User, {
    name: 'user',
    description: 'Get a single user by unique criteria.',
  })
  findOne(@Args() args: FindUniqueUserArgs) {
    return this.usersService.findOne(args)
  }

  @AllowAuthenticated()
  @Mutation(() => User, { description: 'Update an existing user.' })
  async updateUser(
    @Args('updateUserInput') args: UpdateUserInput,
    @GetUser() user: GetUserType,
  ) {
    const userInfo = await this.prisma.user.findUnique({
      where: { uid: args.uid },
    })
    checkRowLevelPermission(user, userInfo.uid)
    return this.usersService.update(args)
  }

  @AllowAuthenticated()
  @Mutation(() => User, { description: 'Delete an existing user.' })
  async removeUser(
    @Args() args: FindUniqueUserArgs,
    @GetUser() user: GetUserType,
  ) {
    const userInfo = await this.prisma.user.findUnique(args)
    checkRowLevelPermission(user, userInfo.uid)
    return this.usersService.remove(args)
  }

  @AllowAuthenticated()
  @Query(() => AuthProvider, {
    name: 'getAuthProvider',
    nullable: true,
    description: 'Get the linked auth provider for a user id.',
  })
  getAuthProvider(@Args('uid') uid: string) {
    return this.prisma.authProvider.findUnique({ where: { uid } })
  }

  @ResolveField(() => Admin, { nullable: true })
  admin(@Parent() user: User) {
    return this.prisma.admin.findUnique({ where: { uid: user.uid } })
  }

  @ResolveField(() => Manager, { nullable: true })
  manager(@Parent() user: User) {
    return this.prisma.manager.findUnique({ where: { uid: user.uid } })
  }

  @ResolveField(() => Valet, { nullable: true })
  valet(@Parent() user: User) {
    return this.prisma.valet.findUnique({ where: { uid: user.uid } })
  }

  @ResolveField(() => Customer, { nullable: true })
  customer(@Parent() user: User) {
    return this.prisma.customer.findUnique({ where: { uid: user.uid } })
  }
}
