import { ApiProperty } from '@nestjs/swagger';

export default class FreeDaysDTO {
  @ApiProperty({ example: 3 })
  days: number;
  @ApiProperty({ example: '2022-03-11' })
  from: string;
  @ApiProperty({ example: '2022-03-13' })
  to: string;
}
