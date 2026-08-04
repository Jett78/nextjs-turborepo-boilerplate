import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { GalleryRepository } from './gallery.repository';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';

@Injectable()
export class GalleryService {
  private readonly logger = new Logger(GalleryService.name);

  constructor(private readonly repository: GalleryRepository) {}

  private generateSlug(title: string): string {
    return title
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

  async create(dto: CreateGalleryDto) {
    try {
      const maxSortOrder = await this.repository.findMaxSortOrder();
      const slug = dto.slug || this.generateSlug(dto.title);
      const uniqueSlug = await this.ensureUniqueSlug(slug);

      const item = await this.repository.create({
        title: dto.title,
        slug: uniqueSlug,
        description: dto.description,
        images: dto.images,
        category: (dto.category as any) || 'other',
        tags: dto.tags,
        isActive: dto.isActive ?? true,
        sortOrder: maxSortOrder + 1,
      });

      return item;
    } catch (error) {
      this.logger.error(`Failed to create gallery item: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(params?: { skip?: number; take?: number; search?: string; category?: string }) {
    try {
      const { skip = 0, take = 10, search, category } = params || {};
      const items = await this.repository.findAll({ skip, take, search, category });
      return { data: items };
    } catch (error) {
      this.logger.error(`Failed to fetch gallery items: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const item = await this.repository.findById(id);
      if (!item) {
        throw new NotFoundException(`Gallery item with id "${id}" not found`);
      }
      return item;
    } catch (error) {
      this.logger.error(`Failed to fetch gallery item: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findBySlug(slug: string) {
    try {
      const item = await this.repository.findBySlug(slug);
      if (!item) {
        throw new NotFoundException(`Gallery item with slug "${slug}" not found`);
      }
      return item;
    } catch (error) {
      this.logger.error(`Failed to fetch gallery item by slug: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, dto: UpdateGalleryDto) {
    try {
      const existingItem = await this.repository.findById(id);
      if (!existingItem) {
        throw new NotFoundException(`Gallery item with id "${id}" not found`);
      }

      if (dto.sortOrder !== undefined && dto.sortOrder !== existingItem.sortOrder) {
        await this.repository.swapSortOrder(existingItem.sortOrder, dto.sortOrder);
      }

      let slug = dto.slug || existingItem.slug;
      if (dto.title && !dto.slug) {
        slug = this.generateSlug(dto.title);
      }
      if (slug !== existingItem.slug) {
        slug = await this.ensureUniqueSlug(slug, id);
      }

      const updatedItem = await this.repository.update(id, {
        title: dto.title,
        slug,
        description: dto.description,
        images: dto.images,
        category: dto.category as any,
        tags: dto.tags,
        isActive: dto.isActive,
        sortOrder: dto.sortOrder,
      });

      return updatedItem;
    } catch (error) {
      this.logger.error(`Failed to update gallery item: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const item = await this.repository.findById(id);
      if (!item) {
        throw new NotFoundException(`Gallery item with id "${id}" not found`);
      }

      await this.repository.delete(id);
      await this.repository.reorderAfterDelete(item.sortOrder);

      return { message: 'Gallery item deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to delete gallery item: ${error.message}`, error.stack);
      throw error;
    }
  }
}
