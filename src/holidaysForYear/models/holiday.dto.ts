import { ApiProperty } from '@nestjs/swagger';

export default class HolidayDTO {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'ltu' })
  countryCode: string;
  @ApiProperty({
    example: {
      day: 1,
      year: 2022,
      month: 1,
      dayOfWeek: 5,
    },
  })
  date: {
    day: number;
    month: number;
    year: number;
    dayOfWeek: number;
  };
  @ApiProperty({
    example: {
      day: 1,
      year: 2022,
      month: 1,
      dayOfWeek: 5,
    },
    required: false,
  })
  observedOn?: {
    day: number;
    month: number;
    year: number;
    dayOfWeek: number;
  };
  @ApiProperty({
    example: {
      lang: 'lt',
      text: 'Naujieji metai',
    },
  })
  name: {
    lang: string;
    text: string;
  }[];
  @ApiProperty({
    example: {
      lang: 'ltu',
      text: 'some text',
    },
    required: false,
  })
  note?: {
    lang: string;
    text: string;
  }[];
  @ApiProperty({ example: ['Regional holiday'], required: false })
  flags?: string[];
  @ApiProperty({ example: 'Public holiday' })
  holidayType: string;
}
