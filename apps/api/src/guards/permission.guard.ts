import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';
import { PermissionService } from '../modules/permission/permission.service';
import { DB_CONNECTION } from '../db/db.module';
import { user as userTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionService: PermissionService,
    @Inject(DB_CONNECTION)
    private readonly db: NodePgDatabase<Record<string, never>>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const headers = request.headers;

    const sessionCookie = headers?.cookie;
    if (!sessionCookie) {
      throw new ForbiddenException('Authentication required');
    }

    const { auth } = await import('../lib/auth');
    
    let session: any = null;
    try {
      const sessionResult = await auth.api.getSession({
        headers: headers as any,
      });
      session = sessionResult;
    } catch {
      throw new ForbiddenException('Authentication required');
    }

    if (!session?.user) {
      throw new ForbiddenException('Authentication required');
    }

    const userId = session.user.id;
    
    const userRecord = await this.db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    if (!userRecord.length) {
      throw new ForbiddenException('User not found');
    }

    if (userRecord[0].role === 'super_admin') {
      return true;
    }

    const hasPermissions = await this.permissionService.checkPermissions(
      userId,
      requiredPermissions,
    );

    if (!hasPermissions) {
      throw new ForbiddenException(
        `Missing required permissions: ${requiredPermissions.join(', ')}`
      );
    }

    return true;
  }
}
