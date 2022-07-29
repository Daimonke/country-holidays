import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
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
    // get cached countries if available
    const cache: CountryEntity[] = await this.cacheManager.get('countries');
    if (cache !== undefined) return cache;

    const dbData = await this.countryRepository.find();

    // if no data in db, fetch from api and save to db
    if (dbData.length === 0) {
      const res: CountryEntity[] = await this.fetchCountries();
      await this.countryRepository.save(res);
      await this.cacheManager.set('countries', res, { ttl: 3600 });
      return res;
    }

    await this.cacheManager.set('countries', dbData);
    return dbData;
  }

  async fetchCountries(): Promise<CountryEntity[]> {
    const data = await firstValueFrom(
      this.httpService.get(
        'https://kayaposoft.com/enrico/json/v2.0?action=getSupportedCountries',
      ),
    );
    return data.data;
  }
}
