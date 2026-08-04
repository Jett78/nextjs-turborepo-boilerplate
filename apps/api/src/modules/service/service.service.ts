import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ServiceRepository } from './service.repository';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  private readonly logger = new Logger(ServiceService.name);

  constructor(private readonly repository: ServiceRepository) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private async ensureUniqueSlug(slug: string, excludeId?: string): Promise<string> {
    let uniqueSlug = slug;
    let counter = 1;
    while (await this.repository.findBySlug(uniqueSlug, excludeId)) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
    return uniqueSlug;
  }

  async create(dto: CreateServiceDto) {
    try {
      const maxSortOrder = await this.repository.findMaxSortOrder();
      const slug = dto.slug || this.generateSlug(dto.name);
      const uniqueSlug = await this.ensureUniqueSlug(slug);

      const service = await this.repository.create({
        name: dto.name,
        slug: uniqueSlug,
        imageKey: dto.imageKey,
        gallery: dto.gallery,
        shortDescription: dto.shortDescription,
        description: dto.description,
        price: dto.price,
        offerPrice: dto.offerPrice,
        features: dto.features,
        isActive: dto.isActive ?? true,
        sortOrder: maxSortOrder + 1,
      });

      return service;
    } catch (error) {
      this.logger.error(`Failed to create service: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(params?: { skip?: number; take?: number; search?: string }) {
    try {
      const { skip = 0, take = 10, search } = params || {};
      const services = await this.repository.findAll({ skip, take, search });
      return { data: services };
    } catch (error) {
      this.logger.error(`Failed to fetch services: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const service = await this.repository.findById(id);
      if (!service) {
        throw new NotFoundException(`Service with id "${id}" not found`);
      }
      return service;
    } catch (error) {
      this.logger.error(`Failed to fetch service: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findBySlug(slug: string) {
    try {
      const service = await this.repository.findBySlug(slug);
      if (!service) {
        throw new NotFoundException(`Service with slug "${slug}" not found`);
      }
      return service;
    } catch (error) {
      this.logger.error(`Failed to fetch service by slug: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, dto: UpdateServiceDto) {
    try {
      const existingService = await this.repository.findById(id);
      if (!existingService) {
        throw new NotFoundException(`Service with id "${id}" not found`);
      }

      if (dto.sortOrder !== undefined && dto.sortOrder !== existingService.sortOrder) {
        await this.repository.swapSortOrder(existingService.sortOrder, dto.sortOrder);
      }

      let slug = dto.slug || existingService.slug;
      if (dto.name && !dto.slug) {
        slug = this.generateSlug(dto.name);
      }
      if (slug !== existingService.slug) {
        slug = await this.ensureUniqueSlug(slug, id);
      }

      const updatedService = await this.repository.update(id, {
        name: dto.name,
        slug,
        imageKey: dto.imageKey,
        gallery: dto.gallery,
        shortDescription: dto.shortDescription,
        description: dto.description,
        price: dto.price,
        offerPrice: dto.offerPrice,
        features: dto.features,
        isActive: dto.isActive,
        sortOrder: dto.sortOrder,
      });

      return updatedService;
    } catch (error) {
      this.logger.error(`Failed to update service: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const service = await this.repository.findById(id);
      if (!service) {
        throw new NotFoundException(`Service with id "${id}" not found`);
      }

      await this.repository.delete(id);
      await this.repository.reorderAfterDelete(service.sortOrder);

      return { message: 'Service deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to delete service: ${error.message}`, error.stack);
      throw error;
    }
  }
}
