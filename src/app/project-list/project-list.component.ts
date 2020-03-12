import {Component, OnInit} from '@angular/core';

import {ProjectsService} from '../services/project/projects.service';
import {Project} from '../services/project/project.interface';
import {NotifierService} from 'angular-notifier';
import {countDecimals, formatPrice, getDateStringFormatted, isInteger} from '../utils';
import {AuthService} from '../services/auth.service';


@Component({
    selector: 'app-project-list',
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
    projects: Project[] = [];
    search = '';
    isLoading = true;

    constructor(private service: ProjectsService, private notifierService: NotifierService) {
    }

    get role(): string {
        return AuthService.getRole();
    }

    stringifyProject(project: Project) {
        return JSON.stringify(project);
    }

    ngOnInit() {
        if (this.role !== 'Administrador' && this.role !== 'Consultor') {
            return this.notifierService.show({
                type: 'error',
                message: `Oops, parece que te has desviado. No tienes permiso para ver el contenido de esta página.
                     Te invitamos a visitar los que tienes disponibles haciendo click en una de las opciones que te
                     ofrecemos en la barra lateral`
            });
        }
        this.service.getProjects()
            .subscribe(response => {
                this.isLoading = false;
                this.projects = response;
                this.projects = this.projects.map(value => {
                    const start = new Date(value.startDate);
                    const end = new Date(value.endDate);
                    value.startDate = getDateStringFormatted(start);
                    value.endDate = getDateStringFormatted(end);
                    return value;
                });
            }, () => {
                this.isLoading = false;
            });
    }

    getPrice(price: number) {
        return formatPrice(price);
    }
}
