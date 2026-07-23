import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InquiryRepository } from './inquiry.repository';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

@Injectable()
export class InquiryService {
  private readonly logger = new Logger(InquiryService.name);

  constructor(private readonly repository: InquiryRepository) {}

  async create(dto: CreateInquiryDto) {
    try {
      const inquiry = await this.repository.create({
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        message: dto.message,
      });

      return inquiry;
    } catch (error) {
      this.logger.error(`Failed to create inquiry: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(params?: { skip?: number; take?: number; search?: string }) {
    try {
      const { skip = 0, take = 10, search } = params || {};
      const [inquiries, total] = await Promise.all([
        this.repository.findAll({ skip, take, search }),
        this.repository.count({ search }),
      ]);
      return { data: inquiries, total, skip, take, hasMore: skip + take < total };
    } catch (error) {
      this.logger.error(`Failed to fetch inquiries: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const inquiry = await this.repository.findById(id);
      if (!inquiry) {
        throw new NotFoundException(`Inquiry with id "${id}" not found`);
      }
      return inquiry;
    } catch (error) {
      this.logger.error(`Failed to fetch inquiry: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const inquiry = await this.repository.findById(id);
      if (!inquiry) {
        throw new NotFoundException(`Inquiry with id "${id}" not found`);
      }

      await this.repository.delete(id);
      return { message: 'Inquiry deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to delete inquiry: ${error.message}`, error.stack);
      throw error;
    }
  }
}
