import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-car-specs',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './car-specs.html',
  styleUrl: './car-specs.css',
})
export class CarSpecs {
  carId: number;

  constructor(private route: ActivatedRoute) {
    this.carId = Number(this.route.snapshot.paramMap.get('id'));
  }

  carSpecs = {
    engineType: 'V6 3.7L',
    horsepower: '328 HP',
    torque: '269 lb-ft',
    transmissionType: '7-Speed Automatic',
    driveType: 'AWD',
    frontTireSize: '225/55R17',
    rearTireSize: '225/55R17',
  };

  editSpecs() {
    console.log('Edit specs clicked');
    // Later: open edit dialog
  }
}
