import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FullProject, PostProject, Project} from './project.interface';
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

    getProjectById(id: number) {
        return this.http.get<FullProject>(`${environment.baseUrl}projects/${id}`);
    }

    updateProject(body: PostProject, id: number) {
        return this.http.put(`${environment.baseUrl}projects/${id}`, body);
    }

    postProjects(body: PostProject) {
        return this.http.post(`${environment.baseUrl}projects`, body);
    }

    postProjectProgress(projectId: number, milestone: string, date: string) {
        const body = {projectId, milestone, date};
        return this.http.post(`${environment.baseUrl}projects/progress`, body);
    }

    postProjectPayment(projectId: number, amount: string, paymentDate: string) {
        const body = {projectId, amount, paymentDate};
        return this.http.post(`${environment.baseUrl}payments`, body);
    }
}
