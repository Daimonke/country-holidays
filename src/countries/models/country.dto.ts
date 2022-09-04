import { ApiProperty } from '@nestjs/swagger';

export default class CountryDTO {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'ltu' })
  countryCode: string;
  @ApiProperty({ example: ['by', 'bw', 'bb'] })
  regions: string[];
  @ApiProperty({ example: ['public_holiday', 'school_holiday', 'observance'] })
  holidayTypes: string[];
  @ApiProperty({ example: 'Lithuania' })
  fullName: string;
  @ApiProperty({
    example: {
      day: 1,
      month: 1,
      year: 2022,
    },
  })
  fromDate: {
    day: number;
    month: number;
    year: number;
  };
  @ApiProperty({
    example: {
      day: 1,
      month: 1,
      year: 2022,
    },
  })
  toDate: {
    day: number;
    month: number;
    year: number;
  };
}
