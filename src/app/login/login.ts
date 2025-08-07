import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private authService: Auth, private router: Router) {}

  email = '';
  password = '';
  error = signal('');

  async submit() {
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigateByUrl('/');
    } catch (err: any) {
      this.error.set(err.message || 'Login failed');
    }
  }

  async googleLogin() {
    try {
      await this.authService.loginWithGoogle();
      this.router.navigateByUrl('/');
    } catch (err: any) {
      this.error.set(err.message || 'Google login failed');
    }
  }
}
