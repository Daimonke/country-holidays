import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import FreeDaysDTO from '../models/freeDays.dto';
import { FreeDaysInterface } from '../models/freeDays.interface';
import { FreeDaysService } from '../services/freeDays.service';

@Controller('maxFreeDays')
export class FreeDaysController {
  constructor(private readonly freeDays: FreeDaysService) {}
  @ApiResponse({
    status: 200,
    type: FreeDaysDTO,
    isArray: true,
    description: 'Returns maximum free days in a row for a country and a year',
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
  ): Promise<FreeDaysInterface> {
    try {
      const [qyear, qcountry] = [queryYear, queryCountry.toLowerCase()];
      const holidays = await this.freeDays.getHolidays(qyear, qcountry);
      const longestHoliday = this.freeDays.getLongestHoliday(holidays);
      return longestHoliday;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
