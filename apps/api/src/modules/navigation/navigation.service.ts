import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { NavigationRepository } from './navigation.repository';
import { UpdateNavigationDto } from './dto/update-navigation.dto';

@Injectable()
export class NavigationService {
  private readonly logger = new Logger(NavigationService.name);

  constructor(private readonly repository: NavigationRepository) {}

  async findAll(params?: { skip?: number; take?: number; search?: string; isActive?: boolean }) {
    try {
      const { skip = 0, take = 100, search, isActive } = params || {};
      const items = await this.repository.findAll({ skip, take, search, isActive });
      return { data: items };
    } catch (error) {
      this.logger.error(`Failed to fetch navigation items: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const item = await this.repository.findById(id);
      if (!item) {
        throw new NotFoundException(`Navigation item with id "${id}" not found`);
      }
      return item;
    } catch (error) {
      this.logger.error(`Failed to fetch navigation item: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, dto: UpdateNavigationDto) {
    try {
      const existingItem = await this.repository.findById(id);
      if (!existingItem) {
        throw new NotFoundException(`Navigation item with id "${id}" not found`);
      }

      if (dto.sortOrder !== undefined && dto.sortOrder !== existingItem.sortOrder) {
        await this.repository.swapSortOrder(existingItem.sortOrder, dto.sortOrder);
      }

      const updatedItem = await this.repository.update(id, {
        label: dto.label,
        isActive: dto.isActive,
        sortOrder: dto.sortOrder,
      });

      return updatedItem;
    } catch (error) {
      this.logger.error(`Failed to update navigation item: ${error.message}`, error.stack);
      throw error;
    }
  }
}
