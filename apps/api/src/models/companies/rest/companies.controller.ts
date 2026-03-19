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
import { CreateCompany } from './dtos/create.dto'
import { CompanyQueryDto } from './dtos/query.dto'
import { UpdateCompany } from './dtos/update.dto'
import { CompanyEntity } from './entity/company.entity'
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator'
import { GetUserType } from 'src/common/types'
import { checkRowLevelPermission } from 'src/common/auth/util'

@AllowAuthenticated()
@ApiBearerAuth()
@ApiTags('companies')
@ApiUnauthorizedResponse({
  description: 'Unauthorized - missing or invalid bearer token',
})
@ApiForbiddenResponse({ description: 'Forbidden - must be a company manager' })
@Controller('companies')
export class CompaniesController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a company',
    description: 'Create a new parking company. Manager role required.',
  })
  @ApiBody({ type: CreateCompany, description: 'Company creation data' })
  @ApiCreatedResponse({
    type: CompanyEntity,
    description: 'Company created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid company data' })
  @Post()
  create(@Body() createCompanyDto: CreateCompany) {
    return this.prisma.company.create({ data: createCompanyDto })
  }

  @ApiOperation({
    summary: 'List companies',
    description:
      'Retrieve all companies with optional filtering and pagination',
  })
  @ApiQuery({
    type: CompanyQueryDto,
    description: 'Filtering and pagination options',
  })
  @ApiOkResponse({ type: [CompanyEntity], description: 'List of companies' })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: CompanyQueryDto) {
    return this.prisma.company.findMany({
      ...(skip ? { skip: +skip } : null),
      ...(take ? { take: +take } : null),
      ...(sortBy ? { orderBy: { [sortBy]: order || 'asc' } } : null),
    })
  }

  @ApiOperation({
    summary: 'Get company by ID',
    description: 'Retrieve a single company by its unique identifier',
  })
  @ApiParam({ name: 'id', description: 'Company ID', example: 1 })
  @ApiOkResponse({ type: CompanyEntity, description: 'Company found' })
  @ApiNotFoundResponse({ description: 'Company not found' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.prisma.company.findUnique({ where: { id } })
  }

  @ApiOperation({
    summary: 'Update company by ID',
    description: 'Update an existing company. Manager of the company required.',
  })
  @ApiParam({ name: 'id', description: 'Company ID', example: 1 })
  @ApiBody({ type: UpdateCompany, description: 'Fields to update' })
  @ApiOkResponse({
    type: CompanyEntity,
    description: 'Company updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Company not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCompanyDto: UpdateCompany,
    @GetUser() user: GetUserType,
  ) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: { Managers: true },
    })
    checkRowLevelPermission(
      user,
      company.Managers.map((manager) => manager.uid),
    )
    return this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
    })
  }

  @ApiOperation({
    summary: 'Delete company by ID',
    description: 'Delete an existing company. Manager of the company required.',
  })
  @ApiParam({ name: 'id', description: 'Company ID', example: 1 })
  @ApiOkResponse({
    type: CompanyEntity,
    description: 'Company deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Company not found' })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':id')
  async remove(@Param('id') id: number, @GetUser() user: GetUserType) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: { Managers: true },
    })
    checkRowLevelPermission(
      user,
      company.Managers.map((manager) => manager.uid),
    )
    return this.prisma.company.delete({ where: { id } })
  }
}
