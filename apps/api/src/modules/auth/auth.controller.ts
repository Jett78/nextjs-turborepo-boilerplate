import { Controller, Get, Delete, Post, Patch, Query, Param, Body, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { Session, Public } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { DB_CONNECTION } from '../../db/db.module';
import { user as userTable, session as sessionTable, account as accountTable } from '../../db/schema';
import { desc, eq, and } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { verifyOTP, sendOTP } from '../../lib/auth';
import { hashPassword } from '../../lib/password';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: NodePgDatabase<Record<string, never>>,
  ) {}

  @Get('profile')
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Returns the authenticated user profile. Requires session cookie from Better Auth.',
  })
  @ApiResponse({ status: 200, description: 'Profile fetched successfully' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  async getProfile(@Session() session: UserSession) {
    if (!session?.user) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.db
      .select()
      .from(userTable)
      .where(eq(userTable.id, session.user.id))
      .limit(1);

    // Check if user has a credential account with password
    const credentialAccount = await this.db
      .select()
      .from(accountTable)
      .where(
        and(
          eq(accountTable.userId, session.user.id),
          eq(accountTable.providerId, 'credential')
        )
      )
      .limit(1);

    const hasPassword = credentialAccount.length > 0 && !!credentialAccount[0].password;

    const profileData = user[0] ? { ...user[0], hasPassword } : null;

    return {
      success: true,
      statusCode: 200,
      message: 'Profile fetched successfully',
      data: profileData,
    };
  }

  @Patch('profile')
  @ApiOperation({
    summary: 'Update current user profile',
    description: 'Updates the authenticated user profile. Email cannot be changed.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'John Doe' },
        phone: { type: 'string', example: '+977-9841234567' },
        address: { type: 'string', example: 'Kathmandu, Nepal' },
        image: { type: 'string', example: 'https://s3.amazonaws.com/bucket/image.jpg' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  async updateProfile(
    @Session() session: UserSession,
    @Body('name') name?: string,
    @Body('phone') phone?: string,
    @Body('address') address?: string,
    @Body('image') image?: string,
  ) {
    if (!session?.user) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }

    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (image !== undefined) updateData.image = image;

    if (Object.keys(updateData).length === 0) {
      throw new HttpException('No fields to update', HttpStatus.BAD_REQUEST);
    }

    await this.db
      .update(userTable)
      .set(updateData)
      .where(eq(userTable.id, session.user.id));

    const updatedUser = await this.db
      .select()
      .from(userTable)
      .where(eq(userTable.id, session.user.id))
      .limit(1);

    return {
      success: true,
      statusCode: 200,
      message: 'Profile updated successfully',
      data: updatedUser[0],
    };
  }

  @Get('users')
  @ApiOperation({
    summary: 'Get all users',
    description: 'Returns a list of all registered users. Requires admin session.',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Maximum number of users to return', example: 100 })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Number of users to skip', example: 0 })
  @ApiResponse({ status: 200, description: 'Users fetched successfully' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  async getUsers(
    @Session() session: UserSession,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    if (!session?.user) {
      return {
        success: false,
        statusCode: 401,
        message: 'Not authenticated',
      };
    }

    const users = await this.db
      .select()
      .from(userTable)
      .orderBy(desc(userTable.createdAt))
      .limit(limit || 100)
      .offset(offset || 0);

    return {
      success: true,
      statusCode: 200,
      message: 'Users fetched successfully',
      data: users,
    };
  }

  @Delete('users/:id')
  @ApiOperation({
    summary: 'Delete a user',
    description: 'Deletes a user and all associated sessions and accounts. Requires admin session.',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(
    @Session() session: UserSession,
    @Param('id') id: string,
  ) {
    if (!session?.user) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }

    // Check if user is admin
    const currentUser = await this.db
      .select()
      .from(userTable)
      .where(eq(userTable.id, session.user.id))
      .limit(1);

    if (!currentUser.length || (currentUser[0].role !== 'admin' && currentUser[0].role !== 'super_admin')) {
      throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
    }

    // Check if user exists
    const userToDelete = await this.db
      .select()
      .from(userTable)
      .where(eq(userTable.id, id))
      .limit(1);

    if (!userToDelete.length) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Prevent deleting self
    if (id === session.user.id) {
      throw new HttpException('Cannot delete your own account', HttpStatus.BAD_REQUEST);
    }

    // Delete sessions first
    await this.db.delete(sessionTable).where(eq(sessionTable.userId, id));

    // Delete accounts
    await this.db.delete(accountTable).where(eq(accountTable.userId, id));

    // Delete user
    await this.db.delete(userTable).where(eq(userTable.id, id));

    return {
      success: true,
      statusCode: 200,
      message: 'User deleted successfully',
    };
  }

  @Public()
  @Post('verify-otp')
  @ApiOperation({
    summary: 'Verify email with OTP',
    description: 'Verifies the email address using a 6-digit OTP code.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        otp: { type: 'string', example: '123456' },
      },
      required: ['email', 'otp'],
    },
  })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  async verifyOTP(
    @Body('email') email: string,
    @Body('otp') otp: string,
  ) {
    if (!email || !otp) {
      throw new HttpException('Email and OTP are required', HttpStatus.BAD_REQUEST);
    }

    const isValid = await verifyOTP(email, otp);

    if (!isValid) {
      throw new HttpException('Invalid or expired OTP', HttpStatus.BAD_REQUEST);
    }

    // Mark user as email verified
    await this.db
      .update(userTable)
      .set({ emailVerified: true })
      .where(eq(userTable.email, email));

    return {
      success: true,
      statusCode: 200,
      message: 'Email verified successfully',
    };
  }

  @Public()
  @Post('resend-otp')
  @ApiOperation({
    summary: 'Resend OTP',
    description: 'Resends a new 6-digit OTP to the specified email address.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        name: { type: 'string', example: 'John Doe' },
      },
      required: ['email', 'name'],
    },
  })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 400, description: 'Failed to send OTP' })
  async resendOTP(
    @Body('email') email: string,
    @Body('name') name: string,
  ) {
    if (!email || !name) {
      throw new HttpException('Email and name are required', HttpStatus.BAD_REQUEST);
    }

    try {
      await sendOTP(email, name);
      return {
        success: true,
        statusCode: 200,
        message: 'OTP sent successfully',
      };
    } catch {
      throw new HttpException('Failed to send OTP', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('set-password')
  @ApiOperation({
    summary: 'Set password for Google users',
    description: 'Allows Google OAuth users to set a password for email/password login.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        password: { type: 'string', example: 'newPassword123', minLength: 8 },
      },
      required: ['password'],
    },
  })
  @ApiResponse({ status: 200, description: 'Password set successfully' })
  @ApiResponse({ status: 400, description: 'Password too short' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  async setPassword(
    @Session() session: UserSession,
    @Body('password') password: string,
  ) {
    if (!session?.user) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }

    if (!password || password.length < 8) {
      throw new HttpException('Password must be at least 8 characters', HttpStatus.BAD_REQUEST);
    }

    // Check if user already has a credential account
    const existingAccount = await this.db
      .select()
      .from(accountTable)
      .where(
        and(
          eq(accountTable.userId, session.user.id),
          eq(accountTable.providerId, 'credential')
        )
      )
      .limit(1);

    const hashedPassword = await hashPassword(password);

    if (existingAccount.length > 0) {
      // Update existing credential account
      await this.db
        .update(accountTable)
        .set({ password: hashedPassword })
        .where(eq(accountTable.id, existingAccount[0].id));
    } else {
      // Create new credential account
      const id = crypto.randomUUID();
      await this.db.insert(accountTable).values({
        id,
        accountId: session.user.id,
        providerId: 'credential',
        userId: session.user.id,
        password: hashedPassword,
      });
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Password set successfully',
    };
  }
}
