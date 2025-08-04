import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppShell } from './app-shell/app-shell';

@Component({
  selector: 'app-root',
  imports: [AppShell],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('cartrax-client');
}
