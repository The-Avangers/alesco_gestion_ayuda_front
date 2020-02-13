import {Component, OnInit} from '@angular/core';

import {ProjectsService} from '../services/project/projects.service';
import {Project} from '../services/project/project.interface';

@Component({
    selector: 'app-project-list',
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
    projects: Project[] = [];

    constructor(private service: ProjectsService) {
    }

    ngOnInit() {
        this.service.getProjects()
            .subscribe(response => {
                this.projects = response;
                this.projects = this.projects.map(value => {
                    value.paid = value.paid ? 'Sí' : 'No';
                    value.startDate = new Date(value.startDate).toLocaleDateString();
                    value.endDate = new Date(value.endDate).toLocaleDateString();
                    return value;
                });
            });
    }
}
