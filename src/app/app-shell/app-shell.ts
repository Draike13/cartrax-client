import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-app-shell',
  imports: [
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.css',
})
export class AppShell {
  isLoggedIn = computed(() => this.authService.user() !== null);
  username = computed(() => this.authService.user()?.email || 'User');

  constructor(private authService: Auth) {}

  login() {
    // Navigate to login page (or use popup here if preferred)
    // Replace this with router if needed
    window.location.href = '/login';
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}
