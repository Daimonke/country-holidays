import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { DayService } from '../services/day.service';
import * as moment from 'moment';

@Controller('day')
export class DayController {
  constructor(private readonly dayService: DayService) {}
  @Get()
  async getDayStatus(
    @Query('date (e.g. 2022-07-20)') queryDate: string,
    @Query('countryCode (e.g. ukr)') queryCountry: string,
  ) {
    try {
      if (!moment(queryDate, 'YYYY-MM-DD', true).isValid()) {
        return { status: 'Invalid date' };
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
      throw new HttpException(error, 500);
    }
  }
}
