import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { FaqRepository } from './faq.repository';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Injectable()
export class FaqService {
  private readonly logger = new Logger(FaqService.name);

  constructor(private readonly repository: FaqRepository) {}

  async create(dto: CreateFaqDto) {
    try {
      const maxSortOrder = await this.repository.findMaxSortOrder();

      const faq = await this.repository.create({
        question: dto.question,
        answer: dto.answer,
        isActive: dto.isActive ?? true,
        sortOrder: maxSortOrder + 1,
      });

      return faq;
    } catch (error) {
      this.logger.error(`Failed to create FAQ: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(params?: { skip?: number; take?: number; search?: string; isActive?: boolean }) {
    try {
      const { skip = 0, take = 100, search, isActive } = params || {};
      const faqs = await this.repository.findAll({ skip, take, search, isActive });
      return { data: faqs };
    } catch (error) {
      this.logger.error(`Failed to fetch FAQs: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const faq = await this.repository.findById(id);
      if (!faq) {
        throw new NotFoundException(`FAQ with id "${id}" not found`);
      }
      return faq;
    } catch (error) {
      this.logger.error(`Failed to fetch FAQ: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, dto: UpdateFaqDto) {
    try {
      const existingFaq = await this.repository.findById(id);
      if (!existingFaq) {
        throw new NotFoundException(`FAQ with id "${id}" not found`);
      }

      if (dto.sortOrder !== undefined && dto.sortOrder !== existingFaq.sortOrder) {
        await this.repository.swapSortOrder(existingFaq.sortOrder, dto.sortOrder);
      }

      const updatedFaq = await this.repository.update(id, {
        question: dto.question,
        answer: dto.answer,
        isActive: dto.isActive,
        sortOrder: dto.sortOrder,
      });

      return updatedFaq;
    } catch (error) {
      this.logger.error(`Failed to update FAQ: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const faq = await this.repository.findById(id);
      if (!faq) {
        throw new NotFoundException(`FAQ with id "${id}" not found`);
      }

      await this.repository.delete(id);
      await this.repository.reorderAfterDelete(faq.sortOrder);

      return { message: 'FAQ deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to delete FAQ: ${error.message}`, error.stack);
      throw error;
    }
  }
}
