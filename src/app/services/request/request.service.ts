import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Request, PostRequest} from './request.interface';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  getRequests() {
      return this.http.get<Request[]>(`${environment.baseUrl}requests`);
  }

  getSolRequests(id: number) {
      return this.http.get<Request[]>(`${environment.baseUrl}requests/${id}`);
  }

  postRequest(body: PostRequest) {
      return this.http.post(`${environment.baseUrl}requests`, body);
  }
}
