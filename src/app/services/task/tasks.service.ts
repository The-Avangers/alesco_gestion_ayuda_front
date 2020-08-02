import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private http: HttpClient) {}

  postTask(body: PostTask) {
      return this.http.post(`${environment.baseUrl}tasks`, body);
  }
}
