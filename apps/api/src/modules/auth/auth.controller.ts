import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Get('profile')
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Returns the authenticated user profile. Requires session cookie from Better Auth.',
  })
  @ApiResponse({ status: 200, description: 'Profile fetched successfully' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  async getProfile(@Session() session: UserSession) {
    return {
      success: true,
      statusCode: 200,
      message: 'Profile fetched successfully',
      data: session?.user || null,
    };
  }
}
