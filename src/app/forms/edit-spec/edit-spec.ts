import { Component, effect, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Api } from '../../services/api';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-edit-spec',
  imports: [
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatOptionModule,
    MatAutocompleteModule,
  ],
  templateUrl: './edit-spec.html',
  styleUrl: './edit-spec.css',
})
export class EditSpec {
  specForm!: FormGroup;

  fieldsConfig = [
    {
      control: 'engine_oil_viscosity',
      label: 'Engine Oil Viscosity',
      type: 'engine oil viscosity',
    },
    {
      control: 'engine_oil_quantity',
      label: 'Engine Oil Quantity',
      type: 'engine oil quantity',
    },
    {
      control: 'engine_oil_filter',
      label: 'Engine Oil Filter',
      type: 'engine oil filter',
    },
    {
      control: 'brake_fluid_type',
      label: 'Brake Fluid Type',
      type: 'brake fluid type',
    },
    { control: 'brake_pad', label: 'Brake Pad', type: 'brake pad' },
    { control: 'brake_rotor', label: 'Brake Rotor', type: 'brake rotor' },
    { control: 'tire_size', label: 'Tire Size', type: 'tire size' },
    { control: 'tire_brand', label: 'Tire Type', type: 'tire brand' },
    {
      control: 'transmission_fluid_type',
      label: 'Transmission Fluid Type',
      type: 'transmission fluid type',
    },
    {
      control: 'transmission_fluid_quantity',
      label: 'Transmission Fluid Quantity',
      type: 'transmission fluid quantity',
    },
    { control: 'coolant_type', label: 'Coolant Type', type: 'coolant type' },
    {
      control: 'engine_air_filter',
      label: 'Engine Air Filter',
      type: 'engine air filter',
    },
    {
      control: 'cabin_air_filter',
      label: 'Cabin Air Filter',
      type: 'cabin air filter',
    },
    {
      control: 'wiper_blade_size',
      label: 'Wiper Blade Size',
      type: 'wiper blade size',
    },
    { control: 'headlight', label: 'Headlight', type: 'headlight' },
    { control: 'taillight', label: 'Taillight', type: 'taillight' },
    {
      control: 'turn_signal_light',
      label: 'Turn Signal Light',
      type: 'turn signal light',
    },
    {
      control: 'license_plate_light',
      label: 'License Plate Light',
      type: 'license plate light',
    },
    { control: 'battery', label: 'Battery', type: 'battery' },
    {
      control: 'serpentine_belt',
      label: 'Serpentine Belt',
      type: 'serpentine belt',
    },
    { control: 'thermostat', label: 'Thermostat', type: 'thermostat' },
  ];

  // Maps for parts & filtered results
  allPartsMap: Record<string, { id: number; name: string }[]> = {};
  filteredPartsMap: Record<string, any> = {}; // signals for each field

  // Stores all loaded parts for each type
  allParts: { [key: string]: { id: number; name: string }[] } = {};

  // Stores filtered lists for autocomplete
  filteredParts: { [key: string]: { id: number; name: string }[] } = {};

  constructor(private fb: FormBuilder, private apiService: Api) {
    const group: any = {};
    this.fieldsConfig.forEach((field) => {
      group[field.control] = [''];
      this.allPartsMap[field.control] = [];
      this.filteredPartsMap[field.control] = signal<
        { id: number; name: string }[]
      >([]);
    });
    this.specForm = this.fb.group(group);

    /** Set up search signals + filter effects immediately */
    this.fieldsConfig.forEach((field) => {
      const searchSig = toSignal(
        this.specForm.get(field.control)!.valueChanges,
        { initialValue: '' }
      );

      effect(() => {
        const search = (searchSig() || '').toLowerCase();
        this.filteredPartsMap[field.control].set(
          this.allPartsMap[field.control].filter((p) =>
            p.name.toLowerCase().includes(search)
          )
        );
      });
    });
  }

  async loadPartsForField(field: { control: string; type: string }) {
    if (this.allPartsMap[field.control].length === 0) {
      await this.apiService.loadParts(field.type);

      // Map your backend's {id, data} → {id, name}
      this.allPartsMap[field.control] = this.apiService
        .partsList()
        .map((p) => ({
          id: p.id,
          name: p.data, // map data to name
        }));

      // Initialize filtered list
      this.filteredPartsMap[field.control].set(this.allPartsMap[field.control]);
    }
  }

  cancel() {
    // Close dialog logic here
  }

  async filterParts(field: any, search: string) {
    // Load parts for this type if we haven't yet
    if (!this.allParts[field.type]) {
      await this.apiService.loadParts(field.type);

      // Map { id, data } → { id, name }
      this.allParts[field.type] = this.apiService.partsList().map((p) => ({
        id: p.id,
        name: p.data,
      }));
    }

    // Filter locally
    this.filteredParts[field.control] = this.allParts[field.type].filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  async saveSpecSheet() {
    for (const field of this.fieldsConfig) {
      const value = (this.specForm.value[field.control] || '').trim();
      if (!value) continue;

      const exists = this.allPartsMap[field.control]?.some(
        (p) => p.name.toLowerCase() === value.toLowerCase()
      );

      if (!exists) {
        await this.apiService.createPart(field.type, value);
      }
    }

    console.log('Saving spec sheet:', this.specForm.value);
  }
}
