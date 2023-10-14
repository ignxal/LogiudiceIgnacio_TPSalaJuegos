import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afauth: AngularFireAuth) {}

  async register(email: string, password: string) {
    return await this.afauth.createUserWithEmailAndPassword(email, password);
  }

  async login(email: string, password: string) {
    return await this.afauth.signInWithEmailAndPassword(email, password);
  }

  async loginWithGoogle() {
    return await this.afauth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    );
  }

  getUserLogged() {
    return this.afauth.authState;
  }

  logout() {
    this.afauth.signOut();
  }
}
