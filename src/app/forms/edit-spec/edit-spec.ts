import { Component, effect, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Api } from '../../services/api';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { toSignal } from '@angular/core/rxjs-interop';
import { DialogRef } from '@angular/cdk/dialog';

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
      control: 'engine_oil_viscosity_id',
      label: 'Engine Oil Viscosity',
      type: 'engine oil viscosity',
    },
    {
      control: 'engine_oil_quantity_id',
      label: 'Engine Oil Quantity',
      type: 'engine oil quantity',
    },
    {
      control: 'engine_oil_filter_id',
      label: 'Engine Oil Filter',
      type: 'engine oil filter',
    },
    {
      control: 'brake_fluid_type_id',
      label: 'Brake Fluid Type',
      type: 'brake fluid type',
    },
    { control: 'brake_pad_id', label: 'Brake Pad', type: 'brake pad' },
    { control: 'brake_rotor_id', label: 'Brake Rotor', type: 'brake rotor' },
    { control: 'tire_size_id', label: 'Tire Size', type: 'tire size' },
    { control: 'tire_type_id', label: 'Tire Type', type: 'tire type' },
    {
      control: 'transmission_fluid_type_id',
      label: 'Transmission Fluid Type',
      type: 'transmission fluid type',
    },
    {
      control: 'transmission_fluid_quantity_id',
      label: 'Transmission Fluid Quantity',
      type: 'transmission fluid quantity',
    },
    { control: 'coolant_type_id', label: 'Coolant Type', type: 'coolant type' },
    {
      control: 'engine_air_filter_id',
      label: 'Engine Air Filter',
      type: 'engine air filter',
    },
    {
      control: 'cabin_air_filter_id',
      label: 'Cabin Air Filter',
      type: 'cabin air filter',
    },
    {
      control: 'wiper_blade_size_driver_id',
      label: 'Driver Wiper Blade Size',
      type: 'wiper blade size',
    },
    {
      control: 'wiper_blade_size_passenger_id',
      label: 'Passenger Wiper Blade Size',
      type: 'wiper blade size',
    },
    { control: 'headlight_id', label: 'Headlight', type: 'headlight' },
    { control: 'taillight_id', label: 'Taillight', type: 'taillight' },
    {
      control: 'turn_signal_light_id',
      label: 'Turn Signal Light',
      type: 'turn signal light',
    },
    {
      control: 'license_plate_light_id',
      label: 'License Plate Light',
      type: 'license plate light',
    },
    { control: 'brake_light_id', label: 'Brake Light', type: 'brake light' },
    { control: 'battery_id', label: 'Battery', type: 'battery' },
    {
      control: 'serpentine_belt_id',
      label: 'Serpentine Belt',
      type: 'serpentine belt',
    },
    { control: 'thermostat_id', label: 'Thermostat', type: 'thermostat' },
  ];

  // Maps for parts & filtered results
  allPartsMap: Record<string, { id: number; name: string }[]> = {};
  filteredPartsMap: Record<string, any> = {}; // signals for each field

  // Stores all loaded parts for each type
  allParts: { [key: string]: { id: number; name: string }[] } = {};

  // Stores filtered lists for autocomplete
  filteredParts: { [key: string]: { id: number; name: string }[] } = {};

  constructor(
    private fb: FormBuilder,
    private apiService: Api,
    private dialogRef: DialogRef
  ) {
    /** 1️⃣ Create form group + init maps */
    const group: any = {};
    this.fieldsConfig.forEach((field) => {
      group[field.control] = ['']; // Empty initial form control
      this.allPartsMap[field.control] = []; // Cached list for this field
      this.filteredPartsMap[field.control] = signal<
        { id: number; name: string }[]
      >([]);
    });
    this.specForm = this.fb.group(group);

    /** 2️⃣ Prefill from saved IDs (async, no await in ctor) */
    {
      const currentSpec = this.apiService.selectedSpec();
      if (currentSpec?.spec) {
        (async () => {
          const formValues: any = {};

          await Promise.all(
            this.fieldsConfig.map(async (field) => {
              const raw = currentSpec.spec[field.control]; // could be number | string | null | {data}

              // if backend ever returns a hydrated object, use it
              if (raw && typeof raw === 'object') {
                formValues[field.control] = raw.data ?? '';
                return;
              }

              // empty -> blank input
              if (raw == null || raw === '' || raw === 'null') {
                formValues[field.control] = '';
                return;
              }

              // fetch the part label for this id
              const part = await this.apiService.getPart(field.type, raw);
              formValues[field.control] = part?.data ?? '';
            })
          );

          this.specForm.patchValue(formValues, { emitEvent: false });
        })();
      }
    }

    /** 3️⃣ Preload all parts lists for matching in saveSpecSheet */
    this.fieldsConfig.forEach(async (field) => {
      await this.loadPartsForField(field);
    });

    /** 4️⃣ Set up autocomplete filtering */
    this.fieldsConfig.forEach((field) => {
      const searchSig = toSignal(
        this.specForm.get(field.control)!.valueChanges,
        {
          initialValue: '',
        }
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
    this.dialogRef.close();
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
    if (!this.specForm.valid) return;

    const updatedValues: any = {};

    for (const field of this.fieldsConfig) {
      const control = this.specForm.get(field.control);

      // 1️ Skip untouched fields → prevents overwriting unchanged data
      if (!control?.touched) continue;

      const value = (control.value || '').trim();

      // 2️If blank, clear the field in DB
      if (!value) {
        updatedValues[`${field.control}_id`] = null;
        continue;
      }

      // 3️ Make sure parts list is loaded for this field type
      if (
        !this.allPartsMap[field.control] ||
        this.allPartsMap[field.control].length === 0
      ) {
        await this.loadPartsForField(field); // uses your existing loader
      }

      // 4️ Compare typed value to existing parts list
      const match = this.allPartsMap[field.control]?.find(
        (p) => p.name.trim().toLowerCase() === value.toLowerCase()
      );

      if (match) {
        updatedValues[`${field.control}`] = match.id;
        continue;
      }

      // 5️ If no match → create a new part
      try {
        const newPart = await this.apiService.createPart(field.type, value);
        updatedValues[`${field.control}`] = newPart.id;
      } catch (err) {
        console.error(`Error creating part for ${field.control}`, err);
        return; // Stop save if creation fails
      }
    }

    // 6️ Save only if something changed
    if (Object.keys(updatedValues).length === 0) {
      console.log('No changes to save.');
      return;
    }

    try {
      console.log(this.apiService.selectedCarId()),
        await this.apiService.updateCarSpec(
          this.apiService.selectedCarId()!,
          updatedValues
        );
      this.apiService.updateSpecs.set(true);
      this.dialogRef.close();
      console.log('Spec sheet saved successfully!');
    } catch (err) {
      console.error('Error saving spec sheet', err);
    }
  }
}
