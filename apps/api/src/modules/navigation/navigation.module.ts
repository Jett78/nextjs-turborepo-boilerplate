import { Module } from '@nestjs/common';
import { NavigationController } from './navigation.controller';
import { NavigationService } from './navigation.service';
import { NavigationRepository } from './navigation.repository';
import { DbModule } from '../../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [NavigationController],
  providers: [NavigationService, NavigationRepository],
  exports: [NavigationService],
})
export class NavigationModule {}
