import { Module } from '@nestjs/common';
import { TestimonialController } from './testimonial.controller';
import { TestimonialService } from './testimonial.service';
import { TestimonialRepository } from './testimonial.repository';
import { DbModule } from '../../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [TestimonialController],
  providers: [TestimonialService, TestimonialRepository],
  exports: [TestimonialService],
})
export class TestimonialModule {}
