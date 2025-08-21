import { Injectable } from '@angular/core';
import { Part } from '../models/part-type';
import { Api } from './api';

@Injectable({
  providedIn: 'root',
})
export class PartsLookup {
  private cache = new Map<string, Part[]>(); // key: "battery", "coolant type", "wiper blade size"

  constructor(private apiService: Api) {}

  private toLabel(field: string): string {
    return field
      .replace(/_id$/, '')
      .replace(/_driver$|_passenger$/, '')
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
        if (this.cache.has(label)) return;
        const list = await this.apiService.fetchParts(label); // <-- uses your existing ApiService
        this.cache.set(label, list as unknown as Part[]);
      })
    );
  }

  labelFor(
    fieldOrLabel: string,
    id: number | string | null | undefined
  ): string {
    if (id == null || id === '' || id === 'null') return '';
    const labelKey = fieldOrLabel.includes('_')
      ? this.toLabel(fieldOrLabel)
      : fieldOrLabel.toLowerCase();
    const list = this.cache.get(labelKey);
    if (!list) return '';
    const wanted = Number(id);
    const row = list.find((p) => Number(p.id) === wanted);
    return row?.data ?? '';
  }
}
