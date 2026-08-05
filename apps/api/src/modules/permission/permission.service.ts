import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB_CONNECTION } from '../../db/db.module';
import { permissions, rolePermissions, user as userTable } from '../../db/schema';
import { eq, and, inArray } from 'drizzle-orm';

@Injectable()
export class PermissionService {
  private permissionCache: Map<string, string[]> = new Map();
  private cacheTimestamp: Map<string, number> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000;

  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: NodePgDatabase<Record<string, never>>,
  ) {}

  async getAllPermissions() {
    return await this.db.select().from(permissions);
  }

  async getPermissionsByRole(role: string) {
    const result = await this.db
      .select({
        id: permissions.id,
        resource: permissions.resource,
        action: permissions.action,
        key: permissions.key,
        description: permissions.description,
        createdAt: permissions.createdAt,
        updatedAt: permissions.updatedAt,
      })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.role, role));

    return result;
  }

  async getRolePermissionsMap() {
    const roles = ['admin', 'editor', 'manager', 'customer'];
    const allPermissions = await this.getAllPermissions();
    
    const rolePermissionsMap: Record<string, any[]> = {};

    for (const role of roles) {
      const perms = await this.getPermissionsByRole(role);
      rolePermissionsMap[role] = perms;
    }

    return {
      roles,
      permissions: allPermissions,
      rolePermissions: rolePermissionsMap,
    };
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    const now = Date.now();
    const cached = this.permissionCache.get(userId);
    const cacheTime = this.cacheTimestamp.get(userId);

    if (cached && cacheTime && (now - cacheTime) < this.CACHE_TTL) {
      return cached;
    }

    const userRecord = await this.db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    if (!userRecord.length) {
      return [];
    }

    const userRole = userRecord[0].role;

    if (userRole === 'super_admin') {
      const allPerms = await this.getAllPermissions();
      const permKeys = allPerms.map(p => p.key);
      this.permissionCache.set(userId, permKeys);
      this.cacheTimestamp.set(userId, now);
      return permKeys;
    }

    const userPermissions = await this.getPermissionsByRole(userRole);
    const permKeys = userPermissions.map(p => p.key);

    this.permissionCache.set(userId, permKeys);
    this.cacheTimestamp.set(userId, now);

    return permKeys;
  }

  async checkPermission(userId: string, permissionKey: string): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId);
    return userPermissions.includes(permissionKey);
  }

  async checkPermissions(userId: string, permissionKeys: string[]): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId);
    return permissionKeys.every(key => userPermissions.includes(key));
  }

  async assignPermissionToRole(role: string, permissionKey: string) {
    const validRoles = ['admin', 'editor', 'manager', 'customer'];
    if (!validRoles.includes(role)) {
      throw new BadRequestException('Invalid role');
    }

    const permission = await this.db
      .select()
      .from(permissions)
      .where(eq(permissions.key, permissionKey))
      .limit(1);

    if (!permission.length) {
      throw new NotFoundException(`Permission ${permissionKey} not found`);
    }

    const existing = await this.db
      .select()
      .from(rolePermissions)
      .where(
        and(
          eq(rolePermissions.role, role),
          eq(rolePermissions.permissionId, permission[0].id)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return { message: 'Permission already assigned to role' };
    }

    await this.db.insert(rolePermissions).values({
      role,
      permissionId: permission[0].id,
    });

    this.clearRoleCache(role);

    return { message: 'Permission assigned successfully' };
  }

  async revokePermissionFromRole(role: string, permissionId: string) {
    const validRoles = ['admin', 'editor', 'manager', 'customer'];
    if (!validRoles.includes(role)) {
      throw new BadRequestException('Invalid role');
    }

    const deleted = await this.db
      .delete(rolePermissions)
      .where(
        and(
          eq(rolePermissions.role, role),
          eq(rolePermissions.permissionId, permissionId)
        )
      )
      .returning();

    if (!deleted.length) {
      throw new NotFoundException('Permission assignment not found');
    }

    this.clearRoleCache(role);

    return { message: 'Permission revoked successfully' };
  }

  async syncRolePermissions(role: string, permissionKeys: string[]) {
    const validRoles = ['admin', 'editor', 'manager', 'customer'];
    if (!validRoles.includes(role)) {
      throw new BadRequestException('Invalid role');
    }

    await this.db.delete(rolePermissions).where(eq(rolePermissions.role, role));

    if (permissionKeys.length > 0) {
      const perms = await this.db
        .select()
        .from(permissions)
        .where(inArray(permissions.key, permissionKeys));

      const permissionMap = new Map(perms.map(p => [p.key, p.id]));

      const validPermissionIds = permissionKeys
        .map(key => permissionMap.get(key))
        .filter(id => id !== undefined) as string[];

      if (validPermissionIds.length > 0) {
        const values = validPermissionIds.map(permId => ({
          role,
          permissionId: permId,
        }));

        await this.db.insert(rolePermissions).values(values);
      }
    }

    this.clearRoleCache(role);

    return { 
      message: 'Role permissions synced successfully',
      assigned: permissionKeys.length,
    };
  }

  private clearRoleCache(role: string) {
    for (const [userId, cachedRole] of this.permissionCache.entries()) {
      this.permissionCache.delete(userId);
      this.cacheTimestamp.delete(userId);
    }
  }
}
