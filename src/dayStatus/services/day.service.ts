import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { DayEntity } from '../models/day.entity';

@Injectable()
export class DayService {
  constructor(
    @InjectRepository(DayEntity)
    private readonly dayRepository: Repository<DayEntity>,
    private readonly httpService: HttpService,
  ) {}

  async getStatus(
    date: { year: number; month: number; day: number },
    country: string,
  ): Promise<any> {
    const day = await this.dayRepository
      .createQueryBuilder('day')
      .select('day.status')
      .where(`date->>'year' = :year`, { year: date.year })
      .andWhere(`date->>'month' = :month`, { month: date.month })
      .andWhere(`date->>'day' = :day`, { day: date.day })
      .andWhere('day.countryCode = :country', { country })
      .getOne();

    return day;
  }

  async fetchHoliday(
    date: { year: number; month: number; day: number },
    country: string,
  ): Promise<{ isPublicHoliday: boolean }> {
    const url = `https://kayaposoft.com/enrico/json/v2.0?action=isPublicHoliday&date=${date.day}-${date.month}-${date.year}&country=${country}`;
    const response = await firstValueFrom(this.httpService.get(url));
    if (response.data.isPublicHoliday) {
      await this.saveDay(date, country, 'holiday');
    }
    return response.data;
  }
  async fetchWorkDay(
    date: { year: number; month: number; day: number },
    country: string,
  ): Promise<{ isWorkDay: boolean }> {
    const url = `https://kayaposoft.com/enrico/json/v2.0?action=isWorkDay&date=${date.day}-${date.month}-${date.year}&country=${country}`;
    const response = await firstValueFrom(this.httpService.get(url));
    if (response.data.isWorkDay) {
      await this.saveDay(date, country, 'workday');
    }
    return response.data;
  }

  async saveDay(
    date: { year: number; month: number; day: number },
    country: string,
    status: DayEntity['status'],
  ): Promise<DayEntity> {
    const day = await this.dayRepository.save({
      date: {
        year: date.year,
        month: date.month,
        day: date.day,
      },
      countryCode: country,
      status,
    });
    return day;
  }
}
