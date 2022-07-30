import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('holiday')
export class HolidayEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  countryCode: string;

  @Column({ type: 'jsonb' })
  date: {
    day: number;
    month: number;
    year: number;
    dayOfWeek: number;
  };
  @Column({ type: 'jsonb', nullable: true })
  observedOn?: {
    day: number;
    month: number;
    year: number;
    dayOfWeek: number;
  };

  @Column({ type: 'jsonb' })
  name: {
    lang: string;
    text: string;
  }[];

  @Column({ type: 'simple-array', nullable: true })
  note?: {
    lang: string;
    text: string;
  }[];

  @Column({ type: 'simple-array', nullable: true })
  flags?: string[];

  @Column()
  holidayType: string;
}
