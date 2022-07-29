import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('country')
export class CountryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  countryCode: string;

  @Column({ type: 'simple-array', nullable: false, default: '{}' })
  regions: string[];

  @Column({ type: 'simple-array', nullable: false, default: '{}' })
  holidayTypes: string[];

  @Column()
  fullName: string;

  @Column({ type: 'jsonb', nullable: false })
  fromDate: {
    day: number;
    month: number;
    year: number;
  };

  @Column({ type: 'jsonb', nullable: false })
  toDate: {
    day: number;
    month: number;
    year: number;
  };
}
