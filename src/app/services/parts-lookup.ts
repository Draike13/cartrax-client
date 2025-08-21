import { Injectable } from '@angular/core';
import { Part } from '../models/part-type';
import { Api } from './api';

@Injectable({ providedIn: 'root' })
export class PartsLookup {
  private cache = new Map<string, Part[]>(); // key: normalized label via toLabel()

  constructor(private apiService: Api) {}

  private toLabel(field: string): string {
    return String(field)
      .replace(/_id$/i, '')
      .replace(/_driver$|_passenger$/i, '')
      .replace(/_/g, ' ')
      .toLowerCase()
      .trim();
  }

  async ensureForSpec(spec: any): Promise<void> {
    if (!spec) return;
    const fields = Object.keys(spec).filter(
      (k) => k.endsWith('_id') && spec[k] != null
    );
    const labels = Array.from(new Set(fields.map((f) => this.toLabel(f))));

    await Promise.all(
      labels.map(async (label) => {
        const key = this.toLabel(label); // normalize again for safety
        if (this.cache.has(key)) return;
        const list = await this.apiService.fetchParts(label); // returns Part[]
        this.cache.set(key, list as Part[]);
      })
    );
  }

  labelFor(
    fieldOrLabel: string,
    id: number | string | null | undefined
  ): string {
    if (id == null || id === '' || id === 'null') return '';

    const key = this.toLabel(fieldOrLabel); // <-- always normalize
    const list = this.cache.get(key);
    if (!list) return '';

    const wanted = String(id); // robust compare
    const row = list.find((p) => String((p as any).id) === wanted);
    return row?.data ?? '';
  }
}
