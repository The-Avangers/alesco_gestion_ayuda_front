import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Aid, PostAid} from './aid.interface';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AidService {

  constructor(private http: HttpClient) { }

  getAids() {
    return this.http.get<Aid[]>(`${environment.baseUrl}aids`);
  }

  getAidById(id: number) {
      return this.http.get<Aid>(`${environment.baseUrl}aids/${id}`);
  }

  postAids(body: PostAid) {
      return this.http.post(`${environment.baseUrl}aids`, body);
  }

  updateAid(body: PostAid, id: number) {
      return this.http.put(`${environment.baseUrl}aids/${id}`, body);
  }

  getAidsAvailable() {
      return this.http.get<Aid[]>(`${environment.baseUrl}aids/create`);
  }
}
