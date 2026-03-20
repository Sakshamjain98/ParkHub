import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { FindManyUserArgs, FindUniqueUserArgs } from './dtos/find.args'
import { PrismaService } from 'src/common/prisma/prisma.service'
import {
  LoginInput,
  LoginOutput,
  RegisterWithCredentialsInput,
  RegisterWithProviderInput,
} from './dtos/create-user.input'
import { UpdateUserInput } from './dtos/update-user.input'
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import { createHash, randomBytes, randomUUID } from 'crypto'
import { Prisma } from '@prisma/client'

const ACCESS_TOKEN_TTL_SECONDS = 24 * 60 * 60
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private hashRefreshToken(token: string) {
    return createHash('sha256').update(token).digest('hex')
  }

  private generateRefreshToken() {
    return randomBytes(64).toString('hex')
  }

  private async getUserRoles(uid: string, tx?: Prisma.TransactionClient) {
    const db = tx || this.prisma
    const [admin, manager, valet] = await Promise.all([
      db.admin.findUnique({ where: { uid }, select: { uid: true } }),
      db.manager.findUnique({ where: { uid }, select: { uid: true } }),
      db.valet.findUnique({ where: { uid }, select: { uid: true } }),
    ])

    return [
      ...(admin ? ['admin'] : []),
      ...(manager ? ['manager'] : []),
      ...(valet ? ['valet'] : []),
    ]
  }

  private createAccessToken(uid: string, roles: string[]) {
    return this.jwtService.sign(
      { uid, roles },
      {
        algorithm: 'HS256',
        expiresIn: ACCESS_TOKEN_TTL_SECONDS,
      },
    )
  }

  private async createRefreshTokenRecord(
    uid: string,
    familyId?: string,
    parentId?: string,
    tx?: Prisma.TransactionClient,
  ) {
    const db = tx || this.prisma
    const refreshToken = this.generateRefreshToken()
    const tokenHash = this.hashRefreshToken(refreshToken)
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000)

    const created = await db.refreshToken.create({
      data: {
        uid,
        tokenHash,
        familyId: familyId || randomUUID(),
        parentId,
        expiresAt,
      },
    })

    return { refreshToken, created }
  }

  private async buildLoginOutput(uid: string, refreshToken: string): Promise<LoginOutput> {
    const user = await this.prisma.user.findUnique({ where: { uid } })
    if (!user) {
      throw new UnauthorizedException('User not found while issuing login output.')
    }

    const roles = await this.getUserRoles(uid)
    const token = this.createAccessToken(uid, roles)

    return {
      token,
      refreshToken,
      user,
    }
  }

  private async generateCredentialUserUid() {
    const currentDate = new Date()
    const year = String(currentDate.getFullYear()).slice(-2)
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0')
    const shortDate = `${year}${month}${day}`

    for (let attempt = 0; attempt < 20; attempt++) {
      const suffix = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
      const uid = `USER-${shortDate}-${suffix}`

      const existingUser = await this.prisma.user.findUnique({
        where: { uid },
        select: { uid: true },
      })

      if (!existingUser) {
        return uid
      }
    }

    throw new BadRequestException('Unable to generate unique user id.')
  }

  registerWithProvider({ image, name, uid, type }: RegisterWithProviderInput) {
    return this.prisma.user.create({
      data: {
        uid,
        name,
        image,
        AuthProvider: {
          create: {
            type,
          },
        },
      },
    })
  }

  async registerWithCredentials({
    email,
    name,
    password,
    image,
    role,
  }: RegisterWithCredentialsInput) {
    const existingUser = await this.prisma.credentials.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new BadRequestException('User already exists with this email.')
    }

    // Hash the password
    const salt = bcrypt.genSaltSync()
    const passwordHash = bcrypt.hashSync(password, salt)

    const uid = await this.generateCredentialUserUid()

    return this.prisma.user.create({
      data: {
        uid,
        name,
        image,
        ...(role === 'manager'
          ? {
              Manager: {
                create: {
                  displayName: name,
                },
              },
            }
          : {}),
        Credentials: {
          create: {
            email,
            passwordHash,
          },
        },
        AuthProvider: {
          create: {
            type: 'CREDENTIALS',
          },
        },
      },
      include: {
        Credentials: true,
      },
    })
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    const user = await this.prisma.user.findFirst({
      where: {
        Credentials: { email },
      },
      include: {
        Credentials: true,
      },
    })

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.')
    }

    const isPasswordValid = bcrypt.compareSync(
      password,
      user.Credentials.passwordHash,
    )

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.')
    }

    const { refreshToken } = await this.createRefreshTokenRecord(user.uid)

    return this.buildLoginOutput(user.uid, refreshToken)
  }

  async refreshLogin(refreshToken: string): Promise<LoginOutput> {
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token.')
    }

    const tokenHash = this.hashRefreshToken(refreshToken)
    const currentToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    })

    if (!currentToken) {
      throw new UnauthorizedException('Invalid refresh token.')
    }

    if (currentToken.revokedAt) {
      await this.prisma.refreshToken.updateMany({
        where: { familyId: currentToken.familyId, revokedAt: null },
        data: { revokedAt: new Date() },
      })
      throw new UnauthorizedException('Refresh token reuse detected.')
    }

    if (currentToken.expiresAt.getTime() <= Date.now()) {
      await this.prisma.refreshToken.update({
        where: { id: currentToken.id },
        data: { revokedAt: new Date() },
      })
      throw new UnauthorizedException('Refresh token expired.')
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const { refreshToken: nextRefreshToken, created } =
        await this.createRefreshTokenRecord(
          currentToken.uid,
          currentToken.familyId,
          currentToken.id,
          tx,
        )

      await tx.refreshToken.update({
        where: { id: currentToken.id },
        data: { revokedAt: new Date() },
      })

      return {
        uid: currentToken.uid,
        refreshToken: nextRefreshToken,
      }
    })

    return this.buildLoginOutput(result.uid, result.refreshToken)
  }

  findAll(args: FindManyUserArgs) {
    return this.prisma.user.findMany(args)
  }

  findOne(args: FindUniqueUserArgs) {
    return this.prisma.user.findUnique(args)
  }

  update(updateUserInput: UpdateUserInput) {
    const { uid, ...data } = updateUserInput
    return this.prisma.user.update({
      where: { uid },
      data: data,
    })
  }

  remove(args: FindUniqueUserArgs) {
    return this.prisma.user.delete(args)
  }
}
