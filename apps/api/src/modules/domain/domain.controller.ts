import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { DomainService } from './domain.service';
import { CreateDomainDto } from './dto/create-domain.dto';
import { DomainEntity } from './entities/domain.entity';

@ApiTags('domains')
@Controller('domains')
export class DomainController {
  constructor(private readonly domainService: DomainService) {}

  @Get()
  @ApiOperation({ summary: 'Get all custom domains' })
  @ApiResponse({ status: 200, description: 'Domains fetched successfully', type: [DomainEntity] })
  async findAll() {
    const domains = await this.domainService.findAll();
    return {
      success: true,
      statusCode: 200,
      message: 'Domains fetched successfully',
      data: domains.map(d => new DomainEntity(d)),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a domain by ID' })
  @ApiParam({ name: 'id', description: 'Domain UUID' })
  @ApiResponse({ status: 200, description: 'Domain fetched successfully', type: DomainEntity })
  async findOne(@Param('id') id: string) {
    const domain = await this.domainService.findOne(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Domain fetched successfully',
      data: new DomainEntity(domain),
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a custom domain' })
  @ApiResponse({ status: 201, description: 'Domain added successfully' })
  async addDomain(@Body() dto: CreateDomainDto) {
    const result = await this.domainService.addDomain(dto);
    return {
      success: true,
      statusCode: 201,
      message: 'Domain added successfully',
      data: {
        domain: new DomainEntity(result.domain),
        instructions: result.instructions,
      },
    };
  }

  @Post(':id/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify domain DNS and deploy' })
  @ApiParam({ name: 'id', description: 'Domain UUID' })
  @ApiResponse({ status: 200, description: 'Domain verification started' })
  async verifyDomain(@Param('id') id: string) {
    const domain = await this.domainService.verifyDomain(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Domain verification completed',
      data: new DomainEntity(domain),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a custom domain' })
  @ApiParam({ name: 'id', description: 'Domain UUID' })
  @ApiResponse({ status: 200, description: 'Domain removed successfully' })
  async removeDomain(@Param('id') id: string) {
    const result = await this.domainService.removeDomain(id);
    return {
      success: true,
      statusCode: 200,
      message: result.message,
    };
  }

  @Get(':id/instructions')
  @ApiOperation({ summary: 'Get DNS setup instructions for a domain' })
  @ApiParam({ name: 'id', description: 'Domain UUID' })
  @ApiResponse({ status: 200, description: 'DNS instructions fetched' })
  async getInstructions(@Param('id') id: string) {
    const domain = await this.domainService.findOne(id);
    const instructions = this.domainService.getDnsInstructions(domain.domain);
    return {
      success: true,
      statusCode: 200,
      message: 'DNS instructions fetched',
      data: instructions,
    };
  }
}
