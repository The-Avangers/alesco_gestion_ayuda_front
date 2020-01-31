import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Aid} from './aid.interface';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AidService {

  constructor(private http: HttpClient) { }

  getAids() {
    return this.http.get<Aid[]>(`${environment.baseUrl}aids`);
}
}
