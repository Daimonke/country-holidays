import { Controller, Get, HttpException } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import CountryDTO from '../models/country.dto';
import { CountriesService } from '../services/countries.service';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}
  @ApiResponse({
    status: 200,
    type: CountryDTO,
    isArray: true,
    description: 'Returns available countries list',
  })
  @Get()
  async getCountries() {
    try {
      const countries = await this.countriesService.getCountries();
      if (!countries || countries.length === 0) {
        const newCountries = await this.countriesService.fetchCountries();
        if (newCountries.length === undefined || newCountries.length === 0) {
          throw new HttpException('No data found', 404);
        }
        return newCountries;
      }
      return countries;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
