import {
  Component,
  computed,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteModule,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Api } from '../services/api';
import { Part } from '../models/part-type';
import { Dialog } from '../services/dialog';
import { PART_TYPES } from '../data/part-types';
import { TitleCaseFirstPipe } from '../title-case.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parts-table',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatAutocompleteModule,
    FormsModule,
    TitleCaseFirstPipe,
  ],
  templateUrl: './parts-table.html',
  styleUrl: './parts-table.css',
})
export class PartsTable {
  // car-spec-parts.ts (could be its own constants file)
  SPEC_PART_TYPES = [
    'engine_oil_viscosity',
    'engine_oil_quantity',
    'engine_oil_filter',
    'brake_fluid_type',
    'brake_pad',
    'brake_rotor',
    'tire_size',
    'tire_type',
    'transmission_fluid_type',
    'transmission_fluid_quantity',
    'coolant_type',
    'battery',
    'engine_air_filter',
    'cabin_air_filter',
    'wiper_blade_size',
    'headlight',
    'taillight',
    'turn_signal_light',
    'license_plate_light',
    'brake_light',
    'serpentine_belt',
    'thermostat',
  ];

  displayedColumns = ['type', 'data', 'actions'];
  searchActive: WritableSignal<boolean> = signal(false);

  partTypeSearch = '';

  partTypes = PART_TYPES;
  filteredPartTypes: string[] = [...PART_TYPES];

  filteredCars = computed(() => {
    const allCars = this.apiService.cars();
    const filter = this.apiService.selectedPart();

    if (!filter) return allCars;

    return allCars.filter((car) => {
      const spec = car.spec as Record<string, number | null> | undefined;
      if (!spec) return false;

      // Check if any key in car.spec ends with _id and the value matches filter.id
      return Object.entries(spec).some(
        ([key, value]) =>
          key.endsWith('_id') &&
          typeof value === 'number' &&
          value === filter.id
      );
    });
  });

  partsList() {
    return this.apiService.partsList();
  }
  constructor(
    private apiService: Api,
    private dialogService: Dialog,
    private router: Router
  ) {}

  filterPartTypes() {
    const search = this.partTypeSearch.toLowerCase();
    this.filteredPartTypes = this.partTypes.filter((type) =>
      type.toLowerCase().includes(search)
    );
  }

  selectPartType(type: string) {
    this.apiService.selectedPartType.set(type);
    this.partTypeSearch = type;
  }

  openAddPartDialog() {
    this.dialogService.changeView('addPart');
    this.dialogService.open();
  }

  /** Placeholder: Edit a part */
  editPart(part: Part) {
    this.dialogService.changeView('editPart');
    this.dialogService.open();
    this.dialogService.selectedPart.set(part);
  }

  /** Placeholder: Delete a part */
  deletePart(part: Part) {
    this.apiService.deletePart(part.type, part.id);
  }

  /** Toggle search bar/dialog */
  toggleSearch() {
    this.searchActive.set(!this.searchActive());
  }

  viewCarsWithPart(part: Part) {
    this.apiService.selectedPart.set({
      type: part.type,
      data: part.data,
      id: part.id,
    });
    void this.filterCarsByPart(part);
    this.router.navigate(['/carList']);
  }

  async filterCarsByPart(part: Part) {
    const allCars = await this.apiService.getAllCarsWithSpecs(); // each car has .spec now

    const normalizedType = part.type.toLowerCase().replace(/\s+/g, '_');
    const keys =
      normalizedType === 'wiper_blade_size'
        ? ['wiper_blade_size_driver_id', 'wiper_blade_size_passenger_id'] // shared table; either matches
        : [`${normalizedType}_id`];

    const wantedId = Number(part.id);

    const filtered = allCars.filter((car: any) => {
      const spec = car.spec;
      if (!spec) return false;
      return keys.some((k) => Number(spec[k]) === wantedId);
    });

    this.apiService.lockedCarsList.set(true);
    this.apiService.cars.set(filtered);
    this.dialogService.searchActive.set(true);
    this.router.navigate(['/carList']);
  }

  isSpecPart(): boolean {
    const part = this.apiService.selectedPartType();
    if (!part) return false;

    const normalized = part.toLowerCase().replace(/\s+/g, '_');
    return this.SPEC_PART_TYPES.includes(normalized);
  }

  @ViewChild(MatAutocomplete) auto!: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autoTrigger!: MatAutocompleteTrigger;

  clearPartType(input: HTMLInputElement) {
    this.partTypeSearch = '';
    this.filteredPartTypes = [...this.partTypes]; // reset the list
    this.apiService.selectedPartType.set(null); // clear the active filter
    this.searchActive.set(false); // optional: collapse “search active” UI

    // fully clear any previous selected/checkmarked option
    if (this.auto) {
      this.auto.options.forEach((opt: MatOption) => opt.deselect());
    }
    if (this.autoTrigger) {
      this.autoTrigger.closePanel(); // reset active item/highlight
    }
    input.focus();
  }
}
