import { CacheModule, Module } from '@nestjs/common';
import { FreeDaysService } from './services/freeDays.service';
import { FreeDaysController } from './controllers/freeDays.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { HolidayEntity } from 'src/holidaysForYear/models/holiday.entity';
import { HolidaysController } from 'src/holidaysForYear/controllers/holidays.controller';
import { HolidaysService } from 'src/holidaysForYear/services/holidays.service';
import { DayController } from 'src/dayStatus/controllers/day.controller';
import { DayService } from 'src/dayStatus/services/day.service';
import { DayEntity } from 'src/dayStatus/models/day.entity';

@Module({
  providers: [
    FreeDaysService,
    HolidaysController,
    HolidaysService,
    DayController,
    DayService,
  ],
  controllers: [FreeDaysController],
  imports: [
    TypeOrmModule.forFeature([HolidayEntity]),
    TypeOrmModule.forFeature([DayEntity]),
    HttpModule,
    CacheModule.register(),
  ],
})
export class FreeDaysModule {}
