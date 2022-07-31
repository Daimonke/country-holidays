import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('days')
export class DayEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  countryCode: string;

  @Column()
  status: 'holiday' | 'workday' | 'freeday';

  @Column({ type: 'jsonb' })
  date: {
    day: number;
    month: number;
    year: number;
  };
}
