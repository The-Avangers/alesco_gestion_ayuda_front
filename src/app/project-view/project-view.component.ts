import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {ProjectsService} from '../services/project/projects.service';
import {ActivatedRoute} from '@angular/router';
import {FullProject, Project} from '../services/project/project.interface';
import {filterTable, formatPrice, getDateStringFormatted, paginateObject} from '../utils';
import {ChartDataSets, ChartType} from 'chart.js';
import {BaseChartDirective, Label, SingleOrMultiDataSet} from 'ng2-charts';
import {TasksService} from '../services/task/tasks.service';
import {Task} from '../services/task/task.interface';
import {PageEvent} from '@angular/material';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.css']
})
export class ProjectViewComponent implements OnInit {
    isLoading = true;
    projectId: number;
    project: FullProject;
    tasks: Task[];
    search = '';
    paginatedTasks: Task[][] = [];
    currentPage: Task[] = [];
    private pageSize = 10;
    tasksLength: number;
    pieChartLabels = ['Tareas Completadas', 'Tareas Sin Completar'];
    pieChartType: ChartType = 'pie';
    pieChartData: SingleOrMultiDataSet;

    barChartOptions = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    barChartLabels: Label;
    barChartType: ChartType = 'bar';
    barChartLegend = true;
    barChartData: { data: number[]; label: string; }[];


  constructor(private projectsService: ProjectsService, private tasksService: TasksService, private route: ActivatedRoute) { }

  ngOnInit() {
      this.route.params.subscribe(params => {
          this.projectId = params.projectId;
          this.projectsService.getProjectById(this.projectId).subscribe(response => {
              this.project = response;
              this.tasksLength = this.project.tasks.length;
              this.tasks = this.project.tasks;
              let completedTasks = 0;
              const peopleInChargeTasks = {};
              this.barChartLabels = this.peopleInCharge.map(person => {
                  // @ts-ignore
                  peopleInChargeTasks[`${person.firstName} ${person.lastName}`] = {
                      completed: 0,
                      notCompleted: 0
                  };
                  return `${person.firstName} ${person.lastName}`;
              });
              this.project.tasks.map(task => {
                  completedTasks += task.completed ? 1 : 0;
                  task.people.map(person => {
                      if (task.completed) {
                          // @ts-ignore
                          peopleInChargeTasks[`${person.firstName} ${person.lastName}`].completed += 1;
                      } else {
                          // @ts-ignore
                          peopleInChargeTasks[`${person.firstName} ${person.lastName}`].notCompleted += 1;
                      }
                  });
              });
              const completedData: number[] = [];
              const notCompletedData: number[] = [];
              Object.keys(peopleInChargeTasks).map(key => {
                  // @ts-ignore
                  completedData.push(peopleInChargeTasks[key].completed);
                  // @ts-ignore
                  notCompletedData.push(peopleInChargeTasks[key].notCompleted);
              });
              this.barChartData = [
                  {data: completedData, label: 'Tareas Completadas'},
                  {data: notCompletedData, label: 'Tareas Sin Completar'}
              ];
              this.pieChartData = [completedTasks, this.tasksLength - completedTasks];
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
          });
      });
  }

  get peopleInCharge() {
      if (this.project) {
          return this.project.peopleInvolved.filter(value => value.role === 'encargado');

      }
  }

  get personConcerned() {
      return this.project.peopleInvolved.filter(value => value.role === 'interesado')[0];
  }

  get price() {
      return formatPrice(this.project.price);
  }

  get startDate() {
      return getDateStringFormatted(new Date(this.project.startDate));
  }

  get endDate() {
      return getDateStringFormatted(new Date(this.project.endDate));
  }

  getDateString(date: Date) {
      return getDateStringFormatted(new Date(date));
  }

  getPriceString(price: number) {
      return formatPrice(price);
  }

  get totalPaid() {
      let amount = 0;
      for (const payment of this.project.payments) {
          amount += payment.amount;
      }
      return amount;
  }

  get role() {
      return AuthService.getRole();
  }

    onPageChanged(event: PageEvent) {
        this.currentPage = this.paginatedTasks[event.pageIndex];
    }

    searchTyped() {
        this.paginatedTasks = paginateObject<Task>(filterTable<Task>(this.tasks, this.search), this.pageSize);
        this.currentPage = this.paginatedTasks[0];
    }

}
