import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { HolidayEntity } from '../models/holiday.entity';

@Injectable()
export class HolidaysService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(HolidayEntity)
    private readonly holidaysRepository: Repository<HolidayEntity>,
    private readonly httpService: HttpService,
  ) {}

  async getHolidays(year: string, country: string): Promise<HolidayEntity[]> {
    try {
      // get cached holidays if available
      const cache: HolidayEntity[] = await this.cacheManager.get(
        `holidays_${year}_${country}`,
      );
      if (cache !== undefined) return cache;
      // query data where year in in jsonb format
      const dbData = await this.holidaysRepository
        .createQueryBuilder('holiday')
        .select()
        .where(`date->>'year' = :year`, { year: year })
        .andWhere(`holiday.countryCode = :countryCode`, {
          countryCode: country,
        })
        .orderBy({
          "holiday.date ->'month'": 'ASC',
        })
        .getMany();

      const dataWithoutNulls = dbData.map((item: HolidayEntity) => {
        Object.keys(item).forEach((key) => {
          if (item[key] === null) {
            delete item[key];
          }
        });
        return item;
      });

      if (dataWithoutNulls.length > 0) {
        await this.cacheManager.set(
          `holidays_${year}_${country}`,
          dataWithoutNulls,
          {
            ttl: 3600,
          },
        );
      }
      return dataWithoutNulls;
    } catch (error) {
      throw new Error(error);
    }
  }

  async fetchHolidays(year: string, country: string): Promise<HolidayEntity[]> {
    try {
      const res = await firstValueFrom(
        this.httpService.get(
          `https://kayaposoft.com/enrico/json/v2.0?action=getHolidaysForYear&year=${year}&country=${country}&holidayType=public_holiday`,
        ),
      );
      const { data } = res;
      if (data.length > 0) {
        const newData = await data.map((item: HolidayEntity) => {
          return {
            ...item,
            countryCode: country,
          };
        });
        await this.holidaysRepository.save(newData);
        return newData;
      }
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
}
