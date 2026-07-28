import { Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from '../../lib/auth';
import { AuthController } from './auth.controller';
import { DbModule } from '../../db/db.module';

@Module({
  imports: [BetterAuthModule.forRoot({ auth }), DbModule],
  controllers: [AuthController],
})
export class AuthModule {}
