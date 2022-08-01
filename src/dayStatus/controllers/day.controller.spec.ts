import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../../app.module';
import { DayEntity } from '../models/day.entity';
import { DayService } from '../services/day.service';
import { DayController } from './day.controller';

jest.setTimeout(30000);

describe('DayController', () => {
  let controller: DayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DayController],
      providers: [DayService],
      imports: [AppModule, TypeOrmModule.forFeature([DayEntity]), HttpModule],
    }).compile();

    controller = module.get<DayController>(DayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a day status', async () => {
    expect(await controller.getDayStatus('2022-01-04', 'ltu')).toEqual({
      status: 'workday',
    });
  });
});
