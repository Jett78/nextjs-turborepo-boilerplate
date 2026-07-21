import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { BlogRepository } from './blog.repository';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { GetBlogsQueryDto } from './dto/get-blogs-query.dto';

@Injectable()
export class BlogService {
  private readonly logger = new Logger(BlogService.name);

  constructor(private readonly repository: BlogRepository) {}

  async create(dto: CreateBlogDto) {
    try {
      const existingBlog = await this.repository.findBySlug(dto.slug);
      if (existingBlog) {
        throw new ConflictException(`Blog with slug "${dto.slug}" already exists`);
      }

      const blog = await this.repository.create({
        title: dto.title,
        slug: dto.slug,
        imageKey: dto.imageKey,
        description: dto.description,
        isActive: dto.isActive ?? true,
      });

      if (dto.seoMeta) {
        const seoMeta = await this.repository.createSeoMeta({
          ...dto.seoMeta,
          blogId: blog.id,
        });
        return { ...blog, seoMeta };
      }

      return blog;
    } catch (error) {
      this.logger.error(`Failed to create blog: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(query: GetBlogsQueryDto) {
    try {
      const { skip = 0, take = 10, search, isActive } = query;

      const [blogs, total] = await Promise.all([
        this.repository.findAll({ skip, take, search, isActive }),
        this.repository.count({ search, isActive }),
      ]);

      const hasMore = skip + take < total;

      return {
        data: blogs,
        total,
        skip,
        take,
        hasMore,
      };
    } catch (error) {
      this.logger.error(`Failed to fetch blogs: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const blog = await this.repository.findById(id);
      if (!blog) {
        throw new NotFoundException(`Blog with id "${id}" not found`);
      }
      return blog;
    } catch (error) {
      this.logger.error(`Failed to fetch blog: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findBySlug(slug: string) {
    try {
      const blog = await this.repository.findBySlug(slug);
      if (!blog) {
        throw new NotFoundException(`Blog with slug "${slug}" not found`);
      }
      return blog;
    } catch (error) {
      this.logger.error(`Failed to fetch blog by slug: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, dto: UpdateBlogDto) {
    try {
      const existingBlog = await this.repository.findById(id);
      if (!existingBlog) {
        throw new NotFoundException(`Blog with id "${id}" not found`);
      }

      if (dto.slug && dto.slug !== existingBlog.slug) {
        const slugExists = await this.repository.findBySlug(dto.slug);
        if (slugExists) {
          throw new ConflictException(`Blog with slug "${dto.slug}" already exists`);
        }
      }

      const updatedBlog = await this.repository.update(id, {
        title: dto.title,
        slug: dto.slug,
        imageKey: dto.imageKey,
        description: dto.description,
        isActive: dto.isActive,
      });

      if (dto.seoMeta) {
        if (existingBlog.seoMeta) {
          await this.repository.updateSeoMeta(id, dto.seoMeta);
        } else {
          await this.repository.createSeoMeta({
            ...dto.seoMeta,
            blogId: id,
          });
        }
      }

      const blog = await this.repository.findById(id);
      if (!blog) {
        throw new NotFoundException(`Blog with id "${id}" not found`);
      }
      return blog!;
    } catch (error) {
      this.logger.error(`Failed to update blog: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const blog = await this.repository.findById(id);
      if (!blog) {
        throw new NotFoundException(`Blog with id "${id}" not found`);
      }

      await this.repository.delete(id);
      return { message: 'Blog deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to delete blog: ${error.message}`, error.stack);
      throw error;
    }
  }
}
