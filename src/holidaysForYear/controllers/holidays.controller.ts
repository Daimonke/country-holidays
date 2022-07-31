import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { HolidaysService } from '../services/holidays.service';

@Controller('holidays')
export class HolidaysController {
  constructor(private readonly holidaysService: HolidaysService) {}

  @Get()
  async getHolidays(
    @Query('year (e.g. 2022)') queryYear: string,
    @Query('countryCode (e.g. ukr)') queryCountry: string,
  ) {
    try {
      const [year, country] = [
        queryYear.toLowerCase(),
        queryCountry.toLowerCase(),
      ];
      if (!year || !country) {
        throw new HttpException('Missing query params', 400);
      }

      const holidays = await this.holidaysService.getHolidays(year, country);
      if (!holidays || holidays.length === 0) {
        const newData = await this.holidaysService.fetchHolidays(year, country);
        if (newData.length === undefined || newData.length === 0) {
          throw new HttpException('No data found', 404);
        }
      }
      return await this.holidaysService.getHolidays(year, country);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
