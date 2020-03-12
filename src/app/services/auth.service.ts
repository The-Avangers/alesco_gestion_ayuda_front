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
      console.log(localStorage.getItem('isAuthenticated') );
      return localStorage.getItem('isAuthenticated') === 'true';
  }
}
