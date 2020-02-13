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
    search = '';
    role: string;
    months = {
        0: 'Enero',
        1: 'Febrero',
        2: 'Marzo',
        3: 'Abril',
        4: 'Mayo',
        5: 'Junio',
        6: 'Julio',
        7: 'Agosto',
        8: 'Septiembre',
        9: 'Octubre',
        10: 'Noviembre',
        11: 'Diciembre',
    };

    constructor(private service: ProjectsService) {
    }

    ngOnInit() {
        this.role = localStorage.getItem('Role')
        this.service.getProjects()
            .subscribe(response => {
                this.projects = response;
                this.projects = this.projects.map(value => {
                    value.paid = value.paid ? 'Sí' : 'No';
                    const start = new Date(value.startDate);
                    const end = new Date(value.endDate);
                    // @ts-ignore
                    value.startDate = `${start.getDate()} de ${this.months[start.getMonth()]} de ${start.getFullYear()}`;
                    // @ts-ignore
                    value.endDate = `${end.getDate()} de ${this.months[end.getMonth()]} de ${end.getFullYear()}`;
                    return value;
                });
            });
    }
}
