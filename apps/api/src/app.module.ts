import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { BlogModule } from './modules/blog/blog.module';
import { AuthModule } from './modules/auth/auth.module';
import { UploadModule } from './modules/upload/upload.module';
import { CompanyProfileModule } from './modules/company-profile/company-profile.module';
import { TestimonialModule } from './modules/testimonial/testimonial.module';
import { InquiryModule } from './modules/inquiry/inquiry.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    BlogModule,
    AuthModule,
    UploadModule,
    CompanyProfileModule,
    TestimonialModule,
    InquiryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
