import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../../app.module';
import { CountryEntity } from '../models/country.entity';
import { CountriesService } from '../services/countries.service';
import { CountriesController } from './countries.controller';

describe('CountriesController', () => {
  let countriesService: CountriesService;
  let countriesController: CountriesController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CountriesController],
      providers: [CountriesService],
      imports: [
        HttpModule,
        CacheModule.register(),
        TypeOrmModule.forFeature([CountryEntity]),
        AppModule,
      ],
    }).compile();

    countriesController =
      moduleRef.get<CountriesController>(CountriesController);
    countriesService = moduleRef.get(CountriesService);
  });
  describe('getCountries', () => {
    it('should return an array of countries', async () => {
      jest.spyOn(countriesService, 'getCountries');

      expect(await countriesController.getCountries()).toBeDefined();
      expect(countriesService.getCountries).toHaveBeenCalled();
      expect((await countriesController.getCountries()).length).toBeGreaterThan(
        0,
      );
    });
  });
});
