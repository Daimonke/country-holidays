import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { DayController } from 'src/dayStatus/controllers/day.controller';
import { DayEntity } from 'src/dayStatus/models/day.entity';
import { HolidaysController } from 'src/holidaysForYear/controllers/holidays.controller';
import { HolidayEntity } from 'src/holidaysForYear/models/holiday.entity';
import { Holiday } from 'src/holidaysForYear/models/holiday.interface';

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

  // omit dayofweek from date
  countHolidaysChain(holidays: HolidayEntity[]): {
    name: string;
    count: number;
    date: Omit<Holiday['date'], 'dayOfWeek'>;
  }[] {
    const chain = [];

    const nextIsHoliday = (date: {
      year: number;
      month: number;
      day: number;
    }) => {
      const { month, day } = date;
      return holidays.some((holiday) => {
        return holiday.date.month === month && holiday.date.day === day;
      });
    };

    holidays.forEach((holiday) => {
      let count = 0;
      let currentDate = holiday.date;
      const name = holiday.name[0].text;
      while (nextIsHoliday(currentDate)) {
        count++;
        currentDate = {
          ...currentDate,
          day: currentDate.day + 1,
        };
      }
      chain.push({
        name,
        count,
        date: holiday.date,
      });
    });
    return chain;
  }

  async isDayFree(
    date: { year: number; month: number; day: number },
    country: string,
  ): Promise<{ status: DayEntity['status'] }> {
    return await this.dayController.getDayStatus(
      `${date.year}-${date.month}-${date.day}`,
      country,
    );
  }
}
