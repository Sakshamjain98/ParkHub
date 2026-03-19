import { Injectable, OnModuleInit } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'

const MAX_QUERY_TAKE = Number(process.env.MAX_QUERY_TAKE || 200)
const MIN_QUERY_TAKE = 1

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private sanitizePaginationArgs(args: Prisma.MiddlewareParams['args']) {
    if (!args || typeof args !== 'object') {
      return
    }

    if (typeof args.take === 'number') {
      args.take = Math.max(MIN_QUERY_TAKE, Math.min(args.take, MAX_QUERY_TAKE))
    }

    if (typeof args.skip === 'number') {
      args.skip = Math.max(0, args.skip)
    }
  }

  async onModuleInit() {
    this.$use(async (params, next) => {
      if (
        params.action === 'findMany' ||
        params.action === 'groupBy' ||
        params.action === 'aggregate'
      ) {
        this.sanitizePaginationArgs(params.args)
      }

      return next(params)
    })

    await this.$connect()
  }
}
