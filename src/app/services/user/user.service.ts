import { Injectable } from '@angular/core';
import {Login, User, PostUser} from './user.interface';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) {
    }
    postLogin(body: Login) {
      return this.http.post<User>(`${environment.baseUrl}login`, body, {observe: 'response'});
    }

    postUser(body: PostUser) {
        return this.http.post<User>(`${environment.baseUrl}user`, body, {observe: 'response'});
    }
}
