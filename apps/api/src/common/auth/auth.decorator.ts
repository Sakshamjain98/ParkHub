import {
  SetMetadata,
  UseGuards,
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common'
import { Role } from 'src/common/types'

import { AuthGuard } from './auth.guard'
import { GqlExecutionContext } from '@nestjs/graphql'

export const AllowAuthenticated = (...roles: Role[]) =>
  applyDecorators(SetMetadata('roles', roles), UseGuards(AuthGuard))

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  if (ctx.getType<string>() === 'http') {
    return ctx.switchToHttp().getRequest().user
  }

  const context = GqlExecutionContext.create(ctx)
  return context.getContext().req.user
})
