import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { DayController } from '../../dayStatus/controllers/day.controller';
import { DayEntity } from '../../dayStatus/models/day.entity';
import { HolidaysController } from '../../holidaysForYear/controllers/holidays.controller';
import { HolidayEntity } from '../../holidaysForYear/models/holiday.entity';

@Injectable()
export class FreeDaysService {
  constructor(
    private readonly httpService: HttpService,
    private readonly holidaysController: HolidaysController,
    private readonly dayController: DayController,
  ) {}
  async getHolidays(year: string, country: string): Promise<HolidayEntity[]> {
    const holidays = await this.holidaysController.getHolidays(year, country);
    return holidays;
  }

  nextIsHoliday = (
    date: { year: number; month: number; day: number },
    holidays: HolidayEntity[],
  ) => {
    const { month, day } = date;
    return holidays.some((holiday) => {
      return holiday.date.month === month && holiday.date.day === day;
    });
  };
  getMaxDays(holiday: {
    name: string;
    count: number;
    date: {
      year: number;
      month: number;
      day: number;
      dayOfWeek: number;
    };
  }) {
    let daysInARow = holiday.count;
    const { date } = holiday;
    let weekendsBeforeCount = 1;
    let weekendsAfterCount = 0;
    while (this.isWeekend(date.dayOfWeek - weekendsBeforeCount)) {
      weekendsBeforeCount++;
      daysInARow++;
    }
    while (
      this.isWeekend(date.dayOfWeek + holiday.count + weekendsAfterCount)
    ) {
      weekendsAfterCount++;
      daysInARow++;
    }
    return {
      count: daysInARow,
      first_day: moment(
        `${date.year}-${date.month}-${date.day - (weekendsBeforeCount - 1)}`,
        'YYYY-MM-DD',
      ).format('YYYY-MM-DD'),
      last_day: moment(
        `${date.year}-${date.month}-${
          date.day + holiday.count - 1 + weekendsAfterCount
        }`,
        'YYYY-MM-DD',
      ).format('YYYY-MM-DD'),
    };
  }
  // omit dayofweek from date
  getLongestHoliday(holidays: HolidayEntity[]): {
    count: number;
    first_day: string;
    last_day: string;
  } {
    const sortedHolidays = [...holidays].sort(
      (a, b) =>
        Number(`${a.date.month}.${a.date.day}`) -
        Number(`${b.date.month}.${b.date.day}`),
    );
    let longestHoliday = {
      count: 0,
      first_day: '',
      last_day: '',
    };
    const mappedHolidays = [];

    sortedHolidays.forEach((holiday) => {
      if (
        !mappedHolidays.some((hol) => {
          return holiday.name[0].text === hol.name[0].text;
        })
      ) {
        let count = 0;
        let currentDate = holiday.date;
        while (this.nextIsHoliday(currentDate, sortedHolidays)) {
          count++;
          currentDate = {
            ...currentDate,
            day: currentDate.day + 1,
          };
        }
        mappedHolidays.push({
          name: holiday.name[0].text,
          count: count,
          date: holiday.date,
        });
      }
    });

    mappedHolidays.forEach((item) => {
      const longestHol = this.getMaxDays(item);
      if (longestHol.count > longestHoliday.count) {
        console.log(longestHol);
        console.log(longestHoliday);
        longestHoliday = longestHol;
      }
    });
    console.log(longestHoliday);
    return longestHoliday;
  }
  isWeekend(day: number) {
    if (day === 6 || day === 7) return true;
    return false;
  }
  async isDayFree(
    date: { year: number; month: number; day: number },
    country: string,
  ): Promise<{ status: DayEntity['status'] }> {
    try {
      const { year, month, day } = date;
      const string = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD').format(
        'YYYY-MM-DD',
      );
      return await this.dayController.getDayStatus(string, country);
    } catch (err) {
      return err;
    }
  }
}
