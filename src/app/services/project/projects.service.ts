import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Project} from './project.interface';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProjectsService {

    constructor(private http: HttpClient) {
    }

    getProjects() {
        return this.http.get<Project[]>(`${environment.baseUrl}projects`);
    }
}
