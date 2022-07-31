import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HolidayEntity } from 'src/holidaysForYear/models/holiday.entity';
import { AppModule } from '../../app.module';
import { FreeDaysService } from '../services/freeDays.service';
import { FreeDaysController } from './freeDays.controller';

describe('DayController', () => {
  let controller: FreeDaysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FreeDaysController],
      providers: [FreeDaysService],
      imports: [
        AppModule,
        TypeOrmModule.forFeature([HolidayEntity]),
        HttpModule,
      ],
    }).compile();

    controller = module.get<FreeDaysController>(FreeDaysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a day status', async () => {
    expect(await controller.getMaxFreeDays('2022-01-04', 'ltu')).toEqual({
      status: 'workday',
    });
  });
});
