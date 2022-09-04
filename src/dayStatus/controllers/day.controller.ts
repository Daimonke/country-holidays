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

      const status = await Promise.all([
        await this.dayService.getStatus(date, country),
        await this.dayService.fetchHoliday(date, country),
        await this.dayService.fetchWorkDay(date, country),
      ]);
      if (status[0] !== null) {
        return { status: status[0].status };
      }
      if (status[1].isPublicHoliday) {
        await this.dayService.saveDay(date, country, 'holiday');
        return { status: 'holiday' };
      }
      if (status[2].isWorkDay) {
        await this.dayService.saveDay(date, country, 'workday');
        return { status: 'workday' };
      }
      this.dayService.saveDay(date, country, 'freeday');
      return { status: 'freeday' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
