import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'
import { Reflector } from '@nestjs/core'
import { Role } from 'src/common/types'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { jwtSecrets } from './jwt-secrets'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = this.getRequest(context)

    if (!req) {
      throw new UnauthorizedException('Unable to resolve request context.')
    }

    await this.authenticateUser(req)

    return this.authorizeUser(req, context)
  }

  private getRequest(context: ExecutionContext) {
    if (context.getType<string>() === 'http') {
      return context.switchToHttp().getRequest()
    }

    const gqlContext = GqlExecutionContext.create(context).getContext()
    return gqlContext?.req
  }

  private async authenticateUser(req: any): Promise<void> {
    const bearerHeader = req.headers.authorization
    // Bearer eylskfdjlsdf309
    const token = bearerHeader?.split(' ')[1]

    if (!token) {
      throw new UnauthorizedException('No token provided.')
    }

    try {
      let payload: { uid?: string } | null = null
      for (const secret of jwtSecrets.allForVerify) {
        try {
          payload = await this.jwtService.verify(token, {
            secret,
            algorithms: ['HS256'],
          })
          break
        } catch {
          // Try next key for rotation support.
        }
      }

      if (!payload) {
        throw new UnauthorizedException('Invalid token signature.')
      }

      const uid = payload.uid
      if (!uid) {
        throw new UnauthorizedException(
          'Invalid token. No uid present in the token.',
        )
      }

      const user = await this.prisma.user.findUnique({ where: { uid } })
      if (!user) {
        throw new UnauthorizedException(
          'Invalid token. No user present with the uid.',
        )
      }

      req.user = payload
    } catch {
      throw new UnauthorizedException('Invalid or expired token.')
    }

    if (!req.user) {
      throw new UnauthorizedException('Invalid token.')
    }
  }

  private async authorizeUser(
    req: any,
    context: ExecutionContext,
  ): Promise<boolean> {
    const requiredRoles = this.getMetadata<Role[]>('roles', context)
    const userRoles = await this.getUserRoles(req.user.uid)
    req.user.roles = userRoles

    if (!requiredRoles || requiredRoles.length === 0) {
      return true
    }

    return requiredRoles.some((role) => userRoles.includes(role))
  }

  private getMetadata<T>(key: string, context: ExecutionContext): T {
    return this.reflector.getAllAndOverride<T>(key, [
      context.getHandler(),
      context.getClass(),
    ])
  }

  private async getUserRoles(uid: string): Promise<Role[]> {
    const roles: Role[] = []

    const [admin, manager, valet] = await Promise.all([
      this.prisma.admin.findUnique({ where: { uid } }),
      this.prisma.manager.findUnique({ where: { uid } }),
      this.prisma.valet.findUnique({ where: { uid } }),
      // Add promises for other role models here
    ])

    admin && roles.push('admin')
    manager && roles.push('manager')
    valet && roles.push('valet')

    return roles
  }
}
