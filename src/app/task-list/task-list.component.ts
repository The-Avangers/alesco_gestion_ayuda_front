import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {TasksService} from '../services/task/tasks.service';
import {NotifierService} from 'angular-notifier';
import {ActivatedRoute, Router} from '@angular/router';
import {Task} from '../services/task/task.interface';
import {filterTable, getDateStringFormatted, paginateObject} from '../utils';
import {PageEvent} from '@angular/material';
import {Project} from '../services/project/project.interface';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
    isLoading = true;
    project: Project;
    projectId: number;
    tasks: Task[];
    search = '';
    paginatedTasks: Task[][] = [];
    currentPage: Task[] = [];
    private pageSize = 10;

  constructor(private taskService: TasksService, private notifierService: NotifierService, private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
      if (this.role !== 'Administrador' && this.role !== 'Consultor') {
          return this.notifierService.show({
              type: 'error',
              message: `Oops, parece que te has desviado. No tienes permiso para ver el contenido de esta página.
                     Te invitamos a visitar los que tienes disponibles haciendo click en una de las opciones que te
                     ofrecemos en la barra lateral`
          });
      }
      this.route.params.subscribe(params => {
            this.taskService.getTasksByProjectId(params.projectId).subscribe(response => {
                this.tasks = response;
                this.project = this.tasks ? this.tasks[0].project : null;
                this.projectId = params.projectId;
                this.tasks = this.tasks.map(value => {
                    if (value.completionDate) {
                        console.log(value.completionDate);
                        let completionDateString: string | string[] = (value.completionDate as string).split('-');
                        completionDateString = completionDateString[0] + `-${completionDateString[1]}-` +
                            parseInt(completionDateString[2], 0).toString();
                        console.log(completionDateString);
                        const completionDate  = new Date(completionDateString);
                        console.log(completionDate);
                        value.completionDate = getDateStringFormatted(completionDate);
                    }
                    return value;
                });
                this.paginatedTasks = paginateObject<Task>(this.tasks, this.pageSize);
                this.currentPage = this.paginatedTasks[0];
                this.isLoading = false;
            }, error => {
                this.isLoading = false;
            });
      });
  }

  onPageChanged(event: PageEvent) {
    this.currentPage = this.paginatedTasks[event.pageIndex];
  }

  searchTyped() {
     this.paginatedTasks = paginateObject<Task>(filterTable<Task>(this.tasks, this.search), this.pageSize);
     this.currentPage = this.paginatedTasks[0];
  }

  get role() {
      return AuthService.getRole();
  }

}
