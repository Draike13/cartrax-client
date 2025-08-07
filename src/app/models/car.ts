export interface Car {
  id: number;
  vin: string;
  model: string;
  make: string;
  trim: string;
  year: number;
  color: string;
  mileage: number;
  notes?: string;
  car_spec?: any;
}
