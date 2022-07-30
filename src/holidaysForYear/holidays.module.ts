import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HolidaysController } from './controllers/holidays.controller';
import { HolidayEntity } from './models/holiday.entity';
import { HolidaysService } from './services/holidays.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HolidayEntity]),
    HttpModule,
    CacheModule.register(),
  ],
  providers: [HolidaysService],
  controllers: [HolidaysController],
})
export class HolidaysModule {}
