import { Component, signal, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Api } from '../services/api';
import { Part } from '../models/part-type';
import { Dialog } from '../services/dialog';
import { PART_TYPES } from '../data/part-types';
import { TitleCaseFirstPipe } from '../title-case.pipe';

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
  displayedColumns = ['type', 'data', 'actions'];
  searchActive: WritableSignal<boolean> = signal(false);

  partTypeSearch = '';

  partTypes = PART_TYPES;
  filteredPartTypes: string[] = [...PART_TYPES];

  partsList() {
    return this.apiService.partsList();
  }
  constructor(private apiService: Api, private dialogServicve: Dialog) {}

  filterPartTypes() {
    const search = this.partTypeSearch.toLowerCase();
    this.filteredPartTypes = this.partTypes.filter((type) =>
      type.toLowerCase().includes(search)
    );
  }

  selectPartType(type: string) {
    this.apiService.selectedPartType.set(type);
    this.partTypeSearch = type;
    console.log('Selected part type:', type);
    console.log(this.apiService.selectedPartType());
  }

  openAddPartDialog() {
    this.dialogServicve.changeView('addPart');
    this.dialogServicve.open();
  }

  /** Placeholder: Edit a part */
  editPart(part: Part) {
    this.dialogServicve.changeView('editPart');
    this.dialogServicve.open();
    console.log('Edit part:', part);
  }

  /** Placeholder: Delete a part */
  deletePart(part: Part) {
    this.apiService.deletePart(part.type, part.id);
    console.log('Delete part:', part);
  }

  /** Toggle search bar/dialog */
  toggleSearch() {
    this.searchActive.set(!this.searchActive());
  }
}
