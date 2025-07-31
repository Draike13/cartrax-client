import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  imports: [],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css',
})
export class MainPage {
  constructor(private router: Router) {}

  goToCarList() {
    this.router.navigate(['carList']);
  }
}
