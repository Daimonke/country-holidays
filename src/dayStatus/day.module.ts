import { Module } from '@nestjs/common';
import { DayService } from './services/day.service';
import { DayController } from './controllers/day.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { DayEntity } from './models/day.entity';

@Module({
  providers: [DayService],
  controllers: [DayController],
  imports: [TypeOrmModule.forFeature([DayEntity]), HttpModule],
})
export class DayModule {}
