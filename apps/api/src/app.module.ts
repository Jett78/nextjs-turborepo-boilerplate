import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { BlogModule } from './modules/blog/blog.module';

@Module({
  imports: [DbModule, BlogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
