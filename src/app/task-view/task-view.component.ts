import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {TasksService} from '../services/task/tasks.service';
import {ActivatedRoute} from '@angular/router';
import {Task} from '../services/task/task.interface';
import {getDateString, getDateStringFormatted} from '../utils';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit {
    isLoading = false;
    task: Task;

  constructor(private tasksService: TasksService, private route: ActivatedRoute) { }

  ngOnInit() {
      this.route.params.subscribe(params => {
          this.tasksService.getTaskById(params.taskId).subscribe(response => {
              this.task = response;
              if (this.task.completed) {
                  let completionDateString: string | string[] = (this.task.completionDate as string).split('-');
                  completionDateString = completionDateString[0] + `-${completionDateString[1]}-` +
                      parseInt(completionDateString[2], 0).toString();
                  this.task.completionDate = getDateStringFormatted(new Date(completionDateString));
                  this.isLoading = false;
              }
          }, error => this.isLoading = false);
      });
  }

  get role() {
      return AuthService.getRole();
  }

}
