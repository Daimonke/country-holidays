import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HolidayEntity } from '../../holidaysForYear/models/holiday.entity';
import { AppModule } from '../../app.module';
import { FreeDaysService } from '../services/freeDays.service';
import { FreeDaysController } from './freeDays.controller';
import { HolidaysController } from '../../holidaysForYear/controllers/holidays.controller';
import { HolidaysService } from '../../holidaysForYear/services/holidays.service';
import { DayController } from '../../dayStatus/controllers/day.controller';
import { DayService } from '../../dayStatus/services/day.service';
import { DayEntity } from '../../dayStatus/models/day.entity';
import { CacheModule } from '@nestjs/common';

describe('freeDaysController', () => {
  let controller: FreeDaysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FreeDaysController],
      providers: [
        FreeDaysService,
        HolidaysController,
        HolidaysService,
        DayController,
        DayService,
      ],
      imports: [
        AppModule,
        TypeOrmModule.forFeature([HolidayEntity]),
        TypeOrmModule.forFeature([DayEntity]),
        HttpModule,
        CacheModule.register(),
      ],
    }).compile();

    controller = module.get<FreeDaysController>(FreeDaysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return max free days for given country and a year', async () => {
    expect(await controller.getMaxFreeDays('2022', 'ltu')).toEqual({
      days: 3,
      from: expect.any(String),
      to: expect.any(String),
    });
  });
});
