export interface Holiday {
  id: number;
  countryCode: string;
  date: {
    day: number;
    month: number;
    year: number;
    dayOfWeek: number;
  };
  observedOn?: {
    day: number;
    month: number;
    year: number;
    dayOfWeek: number;
  };
  name: {
    lang: string;
    text: string;
  }[];
  note?: {
    lang: string;
    text: string;
  }[];
  flags?: string[];
  holidayType: string;
}
