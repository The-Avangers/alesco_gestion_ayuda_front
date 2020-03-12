import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {ProjectsService} from '../services/project/projects.service';
import {ActivatedRoute} from '@angular/router';
import {FullProject, Project} from '../services/project/project.interface';
import {formatPrice, getDateStringFormatted} from '../utils';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.css']
})
export class ProjectViewComponent implements OnInit {
    projectId: number;
    project: FullProject;

  constructor(private projectsService: ProjectsService, private route: ActivatedRoute) { }

  ngOnInit() {
      this.route.params.subscribe(params => {
          this.projectId = params.projectId;
          this.projectsService.getProjectById(this.projectId).subscribe(response => {
              this.project = response;
          });
      });
  }

  get peopleInCharge() {
      return this.project.peopleInvolved.filter(value => value.role === 'encargado');
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
          amount+=payment.amount;
      }
      return amount;
  }

  get role() {
      return AuthService.getRole();
  }

}
