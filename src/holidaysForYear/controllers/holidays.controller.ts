import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { HolidaysService } from '../services/holidays.service';
import { Holiday } from '../models/holiday.interface';
import HolidayDTO from '../models/holiday.dto';

@Controller('holidays')
export class HolidaysController {
  constructor(private readonly holidaysService: HolidaysService) {}
  @ApiResponse({
    status: 200,
    type: HolidayDTO,
    isArray: true,
    description: 'Returns holidays for a country',
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
  async getHolidays(
    @Query('year') queryYear: string,
    @Query('countryCode') queryCountry: string,
  ): Promise<Holiday[]> {
    try {
      if (!queryYear || !queryCountry) {
        throw new HttpException('Missing query params', 400);
      }
      const [year, country] = [
        queryYear.toLowerCase(),
        queryCountry.toLowerCase(),
      ];
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
