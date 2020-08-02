import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Task, PostTask} from './task.interface';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private http: HttpClient) {}

  postTask(body: PostTask) {
      return this.http.post<Task>(`${environment.baseUrl}tasks`, body);
  }

  getTasksByProjectId(projectId: number) {
      return this.http.get<Task[]>(`${environment.baseUrl}tasks?projectId=${projectId}`);
  }

  getTaskById(taskId: number) {
      return this.http.get<Task>(`${environment.baseUrl}tasks/${taskId}`);
  }

  putTask(taskId: number, body: PostTask) {
      return this.http.put<Task>(`${environment.baseUrl}tasks/${taskId}`, body);
  }
}
