import { Injectable } from '@angular/core';
import {Login, User, PostUser, ChangeUserPassword} from './user.interface';
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

    getUsers() {
        return this.http.get<User[]>(`${environment.baseUrl}users`);
    }

    createUser(body: PostUser) {
        return this.http.post<User>(`${environment.baseUrl}users`, body, {observe: 'response'});
    }

    changePassword(body: ChangeUserPassword) {
        return this.http.post<User>(
            `${environment.baseUrl}users/changePassword`, body, {observe: 'response'}
        );
    }
}
