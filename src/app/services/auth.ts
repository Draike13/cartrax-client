import { Injectable, inject, signal } from '@angular/core';
import {
  Auth as FirebaseAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class Auth {
  private auth = inject(FirebaseAuth);
  user = signal<User | null>(null);

  constructor() {
    onAuthStateChanged(this.auth, (u) => this.user.set(u));
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  logout() {
    return signOut(this.auth);
  }

  isAuthenticated() {
    return this.user() !== null;
  }

  async getIdToken(): Promise<string | null> {
    const currentUser = this.auth.currentUser;
    return currentUser ? await currentUser.getIdToken() : null;
  }
}
