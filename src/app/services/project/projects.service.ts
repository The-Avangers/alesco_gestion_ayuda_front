import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PostProject, Project} from './project.interface';
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

    postProjects(body: PostProject) {
        return this.http.post(`${environment.baseUrl}projects`, body);
    }
}
