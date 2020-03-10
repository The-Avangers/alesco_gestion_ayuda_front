import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Person} from './person.interface';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private http: HttpClient) { }

  getPeople() {
      return this.http.get<Person[]>(`${environment.baseUrl}people`);
  }

  getPerson(personId: number) {
      return this.http.get<Person>(`${environment.baseUrl}people/${personId}`);
  }

  postPerson(body: Person) {
      return this.http.post(`${environment.baseUrl}people`, body);
  }

  updatePerson(body: Person, personId: number) {
      return this.http.put(`${environment.baseUrl}people/${personId}`, body);
  }
}
