import { Controller, Get, HttpException, Query } from '@nestjs/common';
import * as moment from 'moment';
import { FreeDaysService } from '../services/freeDays.service';

@Controller('maxFreeDays')
export class FreeDaysController {
  constructor(private readonly freeDays: FreeDaysService) {}
  @Get()
  async getMaxFreeDays(
    @Query('year (e.g. 2022)') queryYear: string,
    @Query('countryCode (e.g. ukr)') queryCountry: string,
  ) {
    try {
      console.log(1);
      const [qyear, qcountry] = [queryYear, queryCountry.toLowerCase()];
      const holidays = await this.freeDays.getHolidays(qyear, qcountry);
      console.log(2);
      const countedChains = this.freeDays.countHolidaysChain(holidays);
      console.log(3);
      let freeDaysInARow = {
        days: 0,
        from: '',
        to: '',
      };
      for (const holiday of countedChains) {
        console.log(4);
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
        console.log(5);
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
      console.log(6);
      return freeDaysInARow;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
