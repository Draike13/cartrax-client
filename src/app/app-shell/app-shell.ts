import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

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
  // Signal to track if user is logged in
  isLoggedIn = signal(false);

  // Signal to store username or display name
  username = signal<string | null>(null);

  constructor() {
    // This could later be replaced with real auth state detection
    // For now, just simulating logged in after 1 second for demo
    setTimeout(() => {
      this.isLoggedIn.set(true);
      this.username.set('Trevor');
    }, 1000);
  }

  login() {
    this.isLoggedIn.set(true);
    this.username.set('Trevor');
  }

  logout() {
    this.isLoggedIn.set(false);
    this.username.set(null);
  }
}
