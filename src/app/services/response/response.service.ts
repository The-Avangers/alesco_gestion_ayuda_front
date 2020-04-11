import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Response} from './response.interface';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {

  constructor(private http: HttpClient) { }

  postResponse(body: Response) {
      return this.http.post(`${environment.baseUrl}response`, body);
  }
}
