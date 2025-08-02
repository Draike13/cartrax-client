import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [MatSidenavModule, MatButtonModule, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  navLinks = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Cars', route: '/cars', icon: 'directions_car' },
    { label: 'Service Records', route: '/service-records', icon: 'build' },
    { label: 'Settings', route: '/settings', icon: 'settings' },
  ];

  constructor(private router: Router) {}

  navigate(route: string) {
    this.router.navigate([route]);
  }
}
