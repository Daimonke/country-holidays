import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../../app.module';
import { HolidayEntity } from '../models/holiday.entity';
import { HolidaysService } from '../services/holidays.service';
import { HolidaysController } from './holidays.controller';

describe('HolidaysController', () => {
  let holidaysService: HolidaysService;
  let holidaysController: HolidaysController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HolidaysController],
      providers: [HolidaysService],
      imports: [
        HttpModule,
        CacheModule.register(),
        TypeOrmModule.forFeature([HolidayEntity]),
        AppModule,
      ],
    }).compile();

    holidaysController = moduleRef.get<HolidaysController>(HolidaysController);
    holidaysService = moduleRef.get(HolidaysService);
  });

  describe('getCountries', () => {
    it('should return an array of countries', async () => {
      jest.spyOn(holidaysService, 'getHolidays');

      expect(await holidaysController.getHolidays('2020', 'est')).toBeDefined();
      expect(holidaysService.getHolidays).toHaveBeenCalled();
      expect(
        (await holidaysController.getHolidays('2020', 'est')).length,
      ).toBeGreaterThan(0);
    });
  });
});
