import { CarSpec } from './car-spec';
export interface Car {
  id: number;
  vin?: string;
  model: string;
  make: string;
  trim?: string;
  year: string;
  color: string;
  mileage?: string;
  notes?: string;
  spec?: CarSpec;
}
