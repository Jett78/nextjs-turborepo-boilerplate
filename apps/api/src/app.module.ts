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
import { SeoModule } from './modules/seo/seo.module';
import { PageSeoModule } from './modules/page-seo/page-seo.module';
import { FaqModule } from './modules/faq/faq.module';
import { DashboardStatsModule } from './modules/dashboard/dashboard-stats.module';
import { PaymentSettingsModule } from './modules/payment-settings/payment-settings.module';
import { KhaltiModule } from './modules/khalti/khalti.module';
import { DomainModule } from './modules/domain/domain.module';
import { TeamModule } from './modules/team/team.module';

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
    SeoModule,
    PageSeoModule,
    FaqModule,
    DashboardStatsModule,
    PaymentSettingsModule,
    KhaltiModule,
    DomainModule,
    TeamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
