import { ApiProperty } from '@nestjs/swagger';

export default class DayDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'ltu' })
  countryCode: string;

  @ApiProperty({ example: 'holiday' })
  status: 'holiday' | 'workday' | 'freeday';

  @ApiProperty({
    example: {
      day: 1,
      month: 2,
      year: 2022,
    },
  })
  date: {
    day: number;
    month: number;
    year: number;
  };
}
