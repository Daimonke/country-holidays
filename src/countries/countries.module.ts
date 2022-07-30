import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesController } from './controllers/countries.controller';
import { CountryEntity } from './models/country.entity';
import { CountriesService } from './services/countries.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CountryEntity]),
    HttpModule,
    CacheModule.register(),
  ],
  providers: [CountriesService],
  controllers: [CountriesController],
})
export class CountriesModule {}
