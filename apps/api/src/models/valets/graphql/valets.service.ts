import { BadRequestException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { FindManyValetArgs, FindUniqueValetArgs } from './dtos/find.args'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { CreateValetInput } from './dtos/create-valet.input'
import { UpdateValetInput } from './dtos/update-valet.input'

@Injectable()
export class ValetsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createValetInput: CreateValetInput) {
    try {
      return await this.prisma.valet.create({
        data: createValetInput,
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Valet UID already exists.')
      }
      throw error
    }
  }

  findAll(args: FindManyValetArgs) {
    return this.prisma.valet.findMany(args)
  }

  findOne(args: FindUniqueValetArgs) {
    return this.prisma.valet.findUnique(args)
  }

  update(updateValetInput: UpdateValetInput) {
    const { uid, ...data } = updateValetInput
    return this.prisma.valet.update({
      where: { uid },
      data: data,
    })
  }

  remove(args: FindUniqueValetArgs) {
    return this.prisma.valet.delete(args)
  }

  async validValet(uid: string) {
    const valet = await this.prisma.valet.findUnique({
      where: { uid: uid },
    })
    if (!valet) {
      throw new BadRequestException('You are not a valet.')
    }
    return valet
  }
}
