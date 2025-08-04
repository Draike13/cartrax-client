import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-service-records',
  imports: [MatIconModule, MatButtonModule, MatTableModule],
  templateUrl: './service-records.html',
  styleUrl: './service-records.css',
})
export class ServiceRecords {
  displayedColumns: string[] = ['serviceDate', 'servicePerformed', 'mileage'];

  records = [
    {
      serviceDate: '06/12/2024',
      servicePerformed: 'Oil Change',
      mileage: '132,000',
    },
    {
      serviceDate: '03/05/2024',
      servicePerformed: 'Brake Pad Replacement',
      mileage: '128,500',
    },
    {
      serviceDate: '11/20/2023',
      servicePerformed: 'Tire Rotation',
      mileage: '125,000',
    },
  ];
}
