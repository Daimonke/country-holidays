import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('countries')
export class CountryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  countryCode: string;

  @Column({ type: 'simple-array', default: '[]' })
  regions: string[];

  @Column({ type: 'simple-array', default: '[]' })
  holidayTypes: string[];

  @Column()
  fullName: string;

  @Column({ type: 'jsonb' })
  fromDate: {
    day: number;
    month: number;
    year: number;
  };

  @Column({ type: 'jsonb' })
  toDate: {
    day: number;
    month: number;
    year: number;
  };
}
