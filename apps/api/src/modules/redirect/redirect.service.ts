import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { RedirectRepository } from './redirect.repository';
import { CreateRedirectDto } from './dto/create-redirect.dto';
import { UpdateRedirectDto } from './dto/update-redirect.dto';

@Injectable()
export class RedirectService {
  private readonly logger = new Logger(RedirectService.name);

  constructor(private readonly repository: RedirectRepository) {}

  async create(dto: CreateRedirectDto) {
    try {
      const existing = await this.repository.findByFromPath(dto.fromPath);
      if (existing) {
        throw new ConflictException(`Redirect from path "${dto.fromPath}" already exists`);
      }

      const redirect = await this.repository.create({
        fromPath: dto.fromPath,
        toPath: dto.toPath,
        isActive: true,
      });

      return redirect;
    } catch (error) {
      this.logger.error(`Failed to create redirect: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(params?: { skip?: number; take?: number; search?: string }) {
    try {
      const { skip = 0, take = 10, search } = params || {};
      const [redirects, total] = await Promise.all([
        this.repository.findAll({ skip, take, search }),
        this.repository.count({ search }),
      ]);

      const hasMore = skip + take < total;

      return {
        data: redirects,
        total,
        skip,
        take,
        hasMore,
      };
    } catch (error) {
      this.logger.error(`Failed to fetch redirects: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAllActive() {
    try {
      const redirects = await this.repository.findAllActive();
      return redirects;
    } catch (error) {
      this.logger.error(`Failed to fetch active redirects: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const redirect = await this.repository.findById(id);
      if (!redirect) {
        throw new NotFoundException(`Redirect with id "${id}" not found`);
      }
      return redirect;
    } catch (error) {
      this.logger.error(`Failed to fetch redirect: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, dto: UpdateRedirectDto) {
    try {
      const existingRedirect = await this.repository.findById(id);
      if (!existingRedirect) {
        throw new NotFoundException(`Redirect with id "${id}" not found`);
      }

      if (dto.fromPath && dto.fromPath !== existingRedirect.fromPath) {
        const duplicate = await this.repository.findByFromPath(dto.fromPath);
        if (duplicate) {
          throw new ConflictException(`Redirect from path "${dto.fromPath}" already exists`);
        }
      }

      const updatedRedirect = await this.repository.update(id, {
        fromPath: dto.fromPath,
        toPath: dto.toPath,
        isActive: dto.isActive,
      });

      return updatedRedirect;
    } catch (error) {
      this.logger.error(`Failed to update redirect: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const redirect = await this.repository.findById(id);
      if (!redirect) {
        throw new NotFoundException(`Redirect with id "${id}" not found`);
      }

      await this.repository.delete(id);

      return { message: 'Redirect deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to delete redirect: ${error.message}`, error.stack);
      throw error;
    }
  }
}
