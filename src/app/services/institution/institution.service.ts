import {Injectable} from '@angular/core';
import {Institution} from './institution.interface';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class InstitutionService {

    constructor(private http: HttpClient) {
    }

    getInstitutions() {
        return this.http.get<Institution[]>(`${environment.baseUrl}institutions`);
    }
}
