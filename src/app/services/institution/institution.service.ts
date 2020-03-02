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

    getInstitution(institutionId: number) {
        return this.http.get<Institution>(`${environment.baseUrl}institutions/${institutionId}`);
    }

    postInstitution(name: string) {
        const body = {
            name
        };
        return this.http.post<Institution>(`${environment.baseUrl}institutions`, body);
    }

    updateInstitution(name: string, id: number) {
        const body = {
            name
        };
        return this.http.put<Institution>(`${environment.baseUrl}institutions/${id}`, body);
    }
}
