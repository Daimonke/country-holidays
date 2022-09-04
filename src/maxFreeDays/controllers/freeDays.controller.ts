import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import * as moment from 'moment';
import FreeDaysDTO from '../models/freeDays.dto';
import { FreeDaysService } from '../services/freeDays.service';

@Controller('maxFreeDays')
export class FreeDaysController {
  constructor(private readonly freeDays: FreeDaysService) {}
  @ApiResponse({
    status: 200,
    type: FreeDaysDTO,
    isArray: true,
    description: 'Returns maximum freedays in a row for a country and a year',
  })
  @ApiQuery({
    name: 'year',
    example: '2022',
  })
  @ApiQuery({
    name: 'countryCode',
    example: 'ltu',
  })
  @Get()
  async getMaxFreeDays(
    @Query('year') queryYear: string,
    @Query('countryCode') queryCountry: string,
  ) {
    try {
      const [qyear, qcountry] = [queryYear, queryCountry.toLowerCase()];
      const holidays = await this.freeDays.getHolidays(qyear, qcountry);
      const countedChains = this.freeDays.countHolidaysChain(holidays);
      let freeDaysInARow = {
        days: 0,
        from: '',
        to: '',
      };
      for (const holiday of countedChains) {
        let negRunning = true;
        let posRunning = true;
        let maxFreeDays = holiday.count;
        let posCount = holiday.count;
        let negCount = -1;
        const { year, month, day } = holiday.date;

        while (negRunning) {
          const { status } = await this.freeDays.isDayFree(
            { year, month, day: day + negCount },
            qcountry,
          );
          if (status === 'freeday' || status === 'holiday') {
            negCount--;
            maxFreeDays++;
          } else {
            negRunning = false;
          }
        }
        while (posRunning) {
          const { status } = await this.freeDays.isDayFree(
            { year, month, day: day + posCount },
            qcountry,
          );
          if (status === 'freeday' || status === 'holiday') {
            posCount++;
            maxFreeDays++;
          } else {
            posRunning = false;
          }
        }
        if (maxFreeDays > freeDaysInARow.days) {
          freeDaysInARow = {
            days: maxFreeDays,
            from: moment(
              `${year}-${month}-${day + negCount + 1}`,
              'YYYY-MM-DD',
            ).format('YYYY-MM-DD'),
            to: moment(
              `${year}-${month}-${day + posCount - 1}`,
              'YYYY-MM-DD',
            ).format('YYYY-MM-DD'),
          };
        }
      }
      return freeDaysInARow;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
