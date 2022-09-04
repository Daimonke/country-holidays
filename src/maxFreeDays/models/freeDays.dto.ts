import { ApiProperty } from '@nestjs/swagger';

export default class FreeDaysDTO {
  @ApiProperty({ example: 5 })
  count: number;
  @ApiProperty({ example: '2025-12-24' })
  first_day: string;
  @ApiProperty({ example: '2025-12-28' })
  last_day: string;
}
