import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { CountriesModule } from './countries/countries.module';
import { DayModule } from './dayStatus/day.module';
import { HolidaysModule } from './holidaysForYear/holidays.module';
import { FreeDaysModule } from './maxFreeDays/freeDays.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.POSTGRES_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      autoLoadEntities: true,
      synchronize: true,
    }),
    CountriesModule,
    HolidaysModule,
    DayModule,
    FreeDaysModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
