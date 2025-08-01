import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Car } from '../models/car';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private baseUrl = 'https:cartrax-api.onrender.com/api';
  readonly getCars;
  private carSignal: WritableSignal<Car[]> = signal([]);
  cars = () => this.carSignal;
  constructor(private http: HttpClient) {
    //get cars from API and convert to Signal
    this.getCars = toSignal(this.http.get<Car[]>(`${this.baseUrl}/cars`), {
      initialValue: [],
    });
  }

  async createCar(newCar: Car) {
    try {
      // Make POST request and wait for result
      const createdCar = await firstValueFrom(
        this.http.post<Car>(`${this.baseUrl}/cars`, { car: newCar })
      );

      // Update the local cars signal
      this.carSignal.update((cars) => [...cars, createdCar]);
    } catch (error) {
      console.error('Error creating car:', error);
    }
  }

  async updateCar(id: number, udatedCar: Car) {
    try {
      const updated = await firstValueFrom(
        this.http.put<Car>(`${this.baseUrl}/cars/${id}`, { car: udatedCar })
      );
      //update the local signal
      this.carSignal.update((cars) =>
        cars.map((car) => (car.id === id ? updated : car))
      );
    } catch (error) {
      console.error('Error updating car:', error);
    }
  }
}
