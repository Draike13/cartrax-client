import { HttpClient } from '@angular/common/http';
import { effect, Injectable, signal, WritableSignal } from '@angular/core';
import { Car } from '../models/car';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { Part } from '../models/part-type';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private baseUrl = 'https:cartrax-api.onrender.com/api';

  updateSignal: WritableSignal<boolean> = signal(false);
  selectedPartType: WritableSignal<string | null> = signal(null);
  selectedCar: WritableSignal<Car | null> = signal(null);
  selectedSpec: WritableSignal<Car | null> = signal(null);

  partsList: WritableSignal<Part[]> = signal([]);
  cars: WritableSignal<Car[]> = signal([]);

  constructor(private http: HttpClient) {
    //effect to control part type page load
    effect(() => {
      const type = this.selectedPartType();
      if (type) {
        this.loadParts(type);
      } else {
        this.partsList.set([]);
      }
    });

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

  async loadParts(type: string) {
    if (!type) return;
    try {
      const parts = await firstValueFrom(
        this.http.get<Part[]>(`${this.baseUrl}/parts?type=${type}`)
      );
      this.partsList.set(parts || []);
    } catch (error) {
      console.error('Error loading parts:', error);
      this.partsList.set([]);
    }
  }

  async createPart(type: string, data: string) {
    try {
      const newPart = await firstValueFrom(
        this.http.post<Part>(`${this.baseUrl}/parts?type=${type}`, {
          part: { data },
        })
      );

      // Push new part into the list without a reload
      await this.loadParts(type);

      return newPart;
    } catch (error) {
      console.error('Error creating part:', error);
      throw error;
    }
  }

  async updatePart(type: string, id: number, data: string) {
    try {
      await firstValueFrom(
        this.http.put<Part>(`${this.baseUrl}/parts/${id}?type=${type}`, {
          part: { data },
        })
      );
      // Refresh parts list after update
      await this.loadParts(type);
    } catch (error) {
      console.error('Error updating part:', error);
    }
  }

  async deletePart(type: string, id: number) {
    try {
      await firstValueFrom(
        this.http.delete(`${this.baseUrl}/parts/${id}?type=${type}`)
      );
      // Refresh parts list after deletion
      await this.loadParts(type);
    } catch (error) {
      console.error('Error deleting part:', error);
    }
  }

  async getCarSpec(carId: number) {
    try {
      const carSpec = await firstValueFrom(
        this.http.get<Car>(`${this.baseUrl}/cars/${carId}?with=specs`)
      );
      console.log('Car specs fetched:', carSpec);
      return carSpec;
    } catch (error) {
      console.error('Error fetching car specs:', error);
      throw error;
    }
  }
}
