import { HttpClient } from '@angular/common/http';
import { effect, Injectable, signal, WritableSignal } from '@angular/core';
import { Car } from '../models/car';
import { firstValueFrom } from 'rxjs';
import { Part } from '../models/part-type';
import { CarSpec } from '../models/car-spec';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private baseUrl = 'http://localhost:3000/api';

  readonly lockedCarsList: WritableSignal<boolean> = signal(false);

  updateSignal: WritableSignal<boolean> = signal(false);
  updateSpecs: WritableSignal<boolean> = signal(false);
  selectedPartType: WritableSignal<string | null> = signal(null);
  selectedCar: WritableSignal<Car | null> = signal(null);
  selectedSpec: WritableSignal<any> = signal({});
  selectedCarId: WritableSignal<number | null> = signal(null);
  selectedPart: WritableSignal<Part | null> = signal(null);

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

  async loadSingleCar(id: number) {
    const car = await firstValueFrom(
      this.http.get<Car>(`${this.baseUrl}/cars/${id}?expand=parts`)
    );
    this.selectedSpec.set(car);
    this.selectedCarId.set(id);
  }

  async getAllCarsWithSpecs() {
    return firstValueFrom(this.http.get<Car[]>(`${this.baseUrl}/cars`));
  }

  async createCar(newCar: Car) {
    return firstValueFrom(
      this.http.post<Car>(`${this.baseUrl}/cars`, newCar)
    ).then(() => this.updateSignal.set(true));
  }

  async updateCar(id: string | number, patch: any) {
    return firstValueFrom(
      this.http.patch<Car>(`${this.baseUrl}/cars/${id}`, patch)
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

  async searchByLicensePlate(plate: string) {
    return firstValueFrom(
      this.http.get<Car>(`${this.baseUrl}/cars/license/${plate}`)
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
        this.http.get<Part[]>(
          `${this.baseUrl}/parts/${encodeURIComponent(type)}`
        )
      );
      this.partsList.set(parts || []);
    } catch (error) {
      console.error('Error loading parts:', error);
      this.partsList.set([]);
    }
  }
  async fetchParts(type: string): Promise<Part[]> {
    if (!type) return [];
    try {
      const url = `${this.baseUrl}/parts/${encodeURIComponent(type)}`;
      const parts = await firstValueFrom(this.http.get<Part[]>(url));
      return parts ?? [];
    } catch (error) {
      console.error('Error fetching parts:', error);
      return [];
    }
  }

  async getPart(type: string, id: number | string): Promise<Part | null> {
    if (!type || id == null) return null;

    const encodedType = encodeURIComponent(type);
    const encodedId = encodeURIComponent(String(id));

    try {
      // If you already have this backend route, this will work directly:
      // GET /api/parts/:type/:id  ->  { id, type, data }
      return await firstValueFrom(
        this.http.get<Part>(`${this.baseUrl}/parts/${encodedType}/${encodedId}`)
      );
    } catch (e) {
      // Fallback (no backend change needed): use your existing list call + find
      try {
        await this.loadParts(type); // this sets partsList()
        const list = this.partsList() || [];
        const wanted = Number(id);
        return list.find((p) => Number(p.id) === wanted) ?? null;
      } catch {
        return null;
      }
    }
  }

  async createPart(type: string, data: string) {
    try {
      const newPart = await firstValueFrom(
        this.http.post<Part>(`${this.baseUrl}/parts/${type}`, { data })
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
        this.http.patch<Part>(`${this.baseUrl}/parts/${type}/${id}`, { data })
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
        this.http.delete(`${this.baseUrl}/parts/${type}/${id}`)
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
        this.http.get<Car>(`${this.baseUrl}/cars/${carId}`)
      );
      console.log('Fetched car specs:', carSpec);
      this.selectedSpec.set(carSpec);
      return carSpec;
    } catch (error) {
      console.error('Error fetching car specs:', error);
      throw error;
    }
  }

  async updateCarSpec(
    carId: number,
    specData: CarSpec,
    opts?: { clear?: boolean }
  ) {
    const q = opts?.clear ? '?clear=1' : '';
    try {
      console.log('Updating car spec with data:', specData);
      const updatedSpec = await firstValueFrom(
        this.http.patch(`${this.baseUrl}/cars/${carId}${q}`, { spec: specData })
      );
      console.log('Car spec updated:', updatedSpec);
    } catch (error: any) {
      console.error('Error updating car spec:', error);
      if (error.error?.errors) {
        throw error;
      }
    }
  }
}
