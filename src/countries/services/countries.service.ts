import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { CountryEntity } from '../models/country.entity';

@Injectable()
export class CountriesService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>,
    private readonly httpService: HttpService,
  ) {}

  async getCountries(): Promise<CountryEntity[]> {
    try {
      // get cached countries if available
      const cache: CountryEntity[] = await this.cacheManager.get('countries');
      if (cache !== undefined) return cache;

      const dbData = await this.countryRepository.find();

      if (dbData.length > 0) {
        await this.cacheManager.set('countries', dbData);
      }
      return [];
    } catch (error) {
      throw new Error(error);
    }
  }

  async fetchCountries(): Promise<CountryEntity[]> {
    try {
      const data = await firstValueFrom(
        this.httpService.get(
          'https://kayaposoft.com/enrico/json/v2.0?action=getSupportedCountries',
        ),
      );
      // deletes all countries before saving new in case of duplication
      await this.countryRepository.delete({});
      await this.countryRepository.save(data.data);
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }
}
