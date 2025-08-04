import { HttpClient } from '@angular/common/http';
import { effect, Injectable, signal, WritableSignal } from '@angular/core';
import { Car } from '../models/car';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private baseUrl = 'https:cartrax-api.onrender.com/api';

  updateSignal: WritableSignal<boolean> = signal(false);
  cars: WritableSignal<Car[]> = signal([]);

  constructor(private http: HttpClient) {
    //effect to control the refresh of the cars signal
    effect(async () => {
      if (this.updateSignal()) {
        this.updateSignal.set(false);
        const cars = await firstValueFrom(
          this.http.get<Car[]>(`${this.baseUrl}/cars`)
        );
        this.cars.set(cars);
      }
    });
  }

  async createCar(newCar: Car) {
    return firstValueFrom(
      this.http.post<Car>(`${this.baseUrl}/cars`, { car: newCar })
    ).then(() => this.updateSignal.set(true));
  }

  async updateCar(id: number, udatedCar: Car) {
    return firstValueFrom(
      this.http.put<Car>(`${this.baseUrl}/cars/${id}`, { car: udatedCar })
    ).then(() => this.updateSignal.set(true));
  }

  async deleteCar(id: number) {
    return firstValueFrom(this.http.delete(`${this.baseUrl}/cars/${id}`)).then(
      () => this.updateSignal.set(true)
    );
  }

  async searchByVin(vin: string) {
    return firstValueFrom(
      this.http.get<Car>(`${this.baseUrl}/cars/vin/${vin}`)
    );
  }

  async searchByFilter(year?: string, make?: string, model?: string) {
    const params: any = {};
    if (year) params.year = year;
    if (make) params.make = make;
    if (model) params.model = model;

    return firstValueFrom(
      this.http.get<Car[]>(`${this.baseUrl}/cars/filter`, { params })
    );
  }
}
