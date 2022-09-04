import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { DayService } from '../services/day.service';
import * as moment from 'moment';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import DayDTO from '../models/day.dto';
import { DayInterface } from '../models/day.interface';

@Controller('day')
export class DayController {
  constructor(private readonly dayService: DayService) {}
  @ApiResponse({
    status: 200,
    type: DayDTO,
    isArray: true,
    description: 'Returns day status',
  })
  @ApiQuery({
    name: 'date',
    example: '2022-02-19',
  })
  @ApiQuery({
    name: 'countryCode',
    example: 'ltu',
  })
  @Get()
  async getDayStatus(
    @Query('date') queryDate: string,
    @Query('countryCode') queryCountry: string,
  ): Promise<DayInterface> {
    try {
      if (!moment(queryDate, 'YYYY-MM-DD', true).isValid()) {
        throw new HttpException('Invalid date', 400);
      }
      const country = queryCountry.toLowerCase();
      const [year, month, day] = queryDate.split('-').map(Number);
      const date = {
        year,
        month,
        day,
      };
      const status = await this.dayService.getStatus(date, country);
      if (status) return status;
      const isHoliday = await this.dayService.fetchHoliday(date, country);
      if (isHoliday.isPublicHoliday) return { status: 'holiday' };
      const isWorkDay = await this.dayService.fetchWorkDay(date, country);
      if (isWorkDay.isWorkDay) return { status: 'workday' };
      await this.dayService.saveDay(date, country, 'freeday');
      return { status: 'freeday' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
