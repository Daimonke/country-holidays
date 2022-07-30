import { Controller, Get, HttpException } from '@nestjs/common';
import { CountriesService } from '../services/countries.service';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async getCountries() {
    try {
      const countries = await this.countriesService.getCountries();
      if (!countries || countries.length === 0) {
        const newCountries = await this.countriesService.fetchCountries();
        if (newCountries.length === undefined || newCountries.length === 0) {
          throw new HttpException('No data found', 404);
        }
      }
      return await this.countriesService.getCountries();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
