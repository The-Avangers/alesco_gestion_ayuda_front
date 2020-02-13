import { Injectable } from '@angular/core';
import {Login} from './user.interface';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) {
    }
    postLogin(body: Login) {
      return this.http.post(`${environment.baseUrl}login`, body);
    }
}
