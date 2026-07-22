import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { TestimonialRepository } from './testimonial.repository';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@Injectable()
export class TestimonialService {
  private readonly logger = new Logger(TestimonialService.name);

  constructor(private readonly repository: TestimonialRepository) {}

  async create(dto: CreateTestimonialDto) {
    try {
      const maxSortOrder = await this.repository.findMaxSortOrder();

      const testimonial = await this.repository.create({
        name: dto.name,
        message: dto.message,
        avatar: dto.avatar,
        designation: dto.designation,
        sortOrder: maxSortOrder + 1,
      });

      return testimonial;
    } catch (error) {
      this.logger.error(`Failed to create testimonial: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(params?: { skip?: number; take?: number; search?: string }) {
    try {
      const { skip = 0, take = 10, search } = params || {};
      const testimonials = await this.repository.findAll({ skip, take, search });
      return { data: testimonials };
    } catch (error) {
      this.logger.error(`Failed to fetch testimonials: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const testimonial = await this.repository.findById(id);
      if (!testimonial) {
        throw new NotFoundException(`Testimonial with id "${id}" not found`);
      }
      return testimonial;
    } catch (error) {
      this.logger.error(`Failed to fetch testimonial: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, dto: UpdateTestimonialDto) {
    try {
      const existingTestimonial = await this.repository.findById(id);
      if (!existingTestimonial) {
        throw new NotFoundException(`Testimonial with id "${id}" not found`);
      }

      if (dto.sortOrder !== undefined && dto.sortOrder !== existingTestimonial.sortOrder) {
        await this.repository.swapSortOrder(existingTestimonial.sortOrder, dto.sortOrder);
      }

      const updatedTestimonial = await this.repository.update(id, {
        name: dto.name,
        message: dto.message,
        avatar: dto.avatar,
        designation: dto.designation,
        sortOrder: dto.sortOrder,
      });

      return updatedTestimonial;
    } catch (error) {
      this.logger.error(`Failed to update testimonial: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const testimonial = await this.repository.findById(id);
      if (!testimonial) {
        throw new NotFoundException(`Testimonial with id "${id}" not found`);
      }

      await this.repository.delete(id);
      await this.repository.reorderAfterDelete(testimonial.sortOrder);

      return { message: 'Testimonial deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to delete testimonial: ${error.message}`, error.stack);
      throw error;
    }
  }
}
