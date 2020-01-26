import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Project} from './project.interface';

@Injectable({
    providedIn: 'root'
})
export class ProjectsService {
    private url = 'http://127.0.0.1:8000/api/';

    constructor(private http: HttpClient) {
    }

    getProjects() {
        return this.http.get<Project[]>(`${this.url}projects`);
    }
}
