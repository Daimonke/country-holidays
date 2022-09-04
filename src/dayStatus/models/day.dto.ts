import { ApiProperty } from '@nestjs/swagger';

export default class DayDTO {
  @ApiProperty({ example: 'workday' })
  status: string;
}
