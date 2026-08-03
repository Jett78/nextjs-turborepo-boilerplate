import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { TeamRepository } from './team.repository';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';

@Injectable()
export class TeamService {
  private readonly logger = new Logger(TeamService.name);

  constructor(private readonly repository: TeamRepository) {}

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

  async create(dto: CreateTeamMemberDto) {
    try {
      const maxSortOrder = await this.repository.findMaxSortOrder();
      const slug = dto.slug || this.generateSlug(dto.name);
      const uniqueSlug = await this.ensureUniqueSlug(slug);

      const teamMember = await this.repository.create({
        name: dto.name,
        slug: uniqueSlug,
        designation: dto.designation,
        joinedDate: dto.joinedDate ? new Date(dto.joinedDate) : undefined,
        message: dto.message,
        avatar: dto.avatar,
        whatsappUrl: dto.whatsappUrl,
        sortOrder: maxSortOrder + 1,
      });

      return teamMember;
    } catch (error) {
      this.logger.error(`Failed to create team member: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(params?: { skip?: number; take?: number; search?: string }) {
    try {
      const { skip = 0, take = 10, search } = params || {};
      const teamMembers = await this.repository.findAll({ skip, take, search });
      return { data: teamMembers };
    } catch (error) {
      this.logger.error(`Failed to fetch team members: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const teamMember = await this.repository.findById(id);
      if (!teamMember) {
        throw new NotFoundException(`Team member with id "${id}" not found`);
      }
      return teamMember;
    } catch (error) {
      this.logger.error(`Failed to fetch team member: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findBySlug(slug: string) {
    try {
      const teamMember = await this.repository.findBySlug(slug);
      if (!teamMember) {
        throw new NotFoundException(`Team member with slug "${slug}" not found`);
      }
      return teamMember;
    } catch (error) {
      this.logger.error(`Failed to fetch team member by slug: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, dto: UpdateTeamMemberDto) {
    try {
      const existingTeamMember = await this.repository.findById(id);
      if (!existingTeamMember) {
        throw new NotFoundException(`Team member with id "${id}" not found`);
      }

      if (dto.sortOrder !== undefined && dto.sortOrder !== existingTeamMember.sortOrder) {
        await this.repository.swapSortOrder(existingTeamMember.sortOrder, dto.sortOrder);
      }

      let slug = dto.slug || existingTeamMember.slug;
      if (dto.name && !dto.slug) {
        slug = this.generateSlug(dto.name);
      }
      if (slug !== existingTeamMember.slug) {
        slug = await this.ensureUniqueSlug(slug, id);
      }

      const updatedTeamMember = await this.repository.update(id, {
        name: dto.name,
        slug,
        designation: dto.designation,
        joinedDate: dto.joinedDate ? new Date(dto.joinedDate) : undefined,
        message: dto.message,
        avatar: dto.avatar,
        whatsappUrl: dto.whatsappUrl,
        sortOrder: dto.sortOrder,
      });

      return updatedTeamMember;
    } catch (error) {
      this.logger.error(`Failed to update team member: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const teamMember = await this.repository.findById(id);
      if (!teamMember) {
        throw new NotFoundException(`Team member with id "${id}" not found`);
      }

      await this.repository.delete(id);
      await this.repository.reorderAfterDelete(teamMember.sortOrder);

      return { message: 'Team member deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to delete team member: ${error.message}`, error.stack);
      throw error;
    }
  }
}
