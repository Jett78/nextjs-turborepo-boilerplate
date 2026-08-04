import { Module } from '@nestjs/common';
import { DbModule } from '../../db/db.module';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { GalleryRepository } from './gallery.repository';

@Module({
  imports: [DbModule],
  controllers: [GalleryController],
  providers: [GalleryService, GalleryRepository],
  exports: [GalleryService],
})
export class GalleryModule {}
