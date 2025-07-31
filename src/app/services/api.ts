import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Car } from '../models/car';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private baseUrl = 'https:cartrax-api.onrender.com/api';
  readonly getCarsRequest;

  constructor(private http: HttpClient) {
    this.getCarsRequest = toSignal(
      this.http.get<Car[]>(`${this.baseUrl}/cars`),
      { initialValue: [] }
    );
  }
}
