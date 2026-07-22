import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthUserResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiProperty()
  role: string;
}

export class AuthTokenResponse {
  @ApiProperty({ type: AuthUserResponse })
  user: AuthUserResponse;

  @ApiProperty()
  token: string;
}

export class AuthResponse {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: AuthTokenResponse })
  data: AuthTokenResponse;
}

export class UserProfileResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName?: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  imageKey?: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;
}
