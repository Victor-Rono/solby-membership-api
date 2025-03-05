/* eslint-disable prettier/prettier */
export interface AgeInterface {
  years: number;
  months: number;
  days: number;
  description?: string;
}

export enum TimeGroupEnum {
  MORNING = 'MORNING',
  MID_DAY = 'MID-DAY',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
  NIGHT = 'NIGHT',
}