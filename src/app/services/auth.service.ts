import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }


  static getRole() {
      return localStorage.getItem('Role');
  }

  isAuthenticated() {
      return Boolean(localStorage.getItem('isAuthenticated') );
  }
}
