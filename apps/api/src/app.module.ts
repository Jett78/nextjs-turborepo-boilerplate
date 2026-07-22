import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { BlogModule } from './modules/blog/blog.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [DbModule, BlogModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
