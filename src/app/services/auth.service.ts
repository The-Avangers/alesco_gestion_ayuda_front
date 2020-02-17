import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isAuthenticated() {
      return Boolean(localStorage.getItem('isAuthenticated') );
  }


  static getRole() {
      return localStorage.getItem('Role');
  }
}
