import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FullProject, Project} from '../services/project/project.interface';
import {ProjectsService} from '../services/project/projects.service';
import {ActivatedRoute, Router} from '@angular/router';
import {getDateString} from '../utils';
import {NotifierService} from 'angular-notifier';

@Component({
    selector: 'app-progress-form',
    templateUrl: './progress-form.component.html',
    styleUrls: ['./progress-form.component.css']
})
export class ProgressFormComponent implements OnInit {
    submitted = false;
    project: FullProject;
    buttonDisabled = false;
    progressForm = new FormGroup({
        name: new FormControl('', Validators.required),
        milestone: new FormControl('', Validators.required),
        date: new FormControl('', Validators.required)
    });

    constructor(private projectsService: ProjectsService, private router: Router,
                private route: ActivatedRoute, private notifierService: NotifierService) {
    }

    ngOnInit() {
        if (this.role !== 'Administrador') {
            return this.notifierService.show({
                type: 'error',
                message: `Oops, parece que te has desviado. No tienes permiso para ver el contenido de esta página.
                     Te invitamos a visitar los que tienes disponibles haciendo click en una de las opciones que te
                     ofrecemos en la barra lateral`
            });
        }

        this.route.params.subscribe(params => {
            this.projectsService.getProjectById(params.projectId).subscribe(response => {
                this.project = response;
                this.f.name.setValue(this.project.name);
                this.f.name.disable();
            });
        });

    }

    getMinProgressDate() {
        let minDate: Date;
        if (this.project.progress.length === 0) {
            minDate = new Date(this.project.startDate);
            minDate.setDate(minDate.getDate() + 1);
        } else {
            minDate = new Date(this.project.progress[this.project.progress.length - 1].date);
            minDate.setDate(minDate.getDate() + 1);
        }
        return getDateString(minDate);
    }

    get f() {
        return this.progressForm.controls;
    }

    get role() {
        return AuthService.getRole();
    }

    onSubmit() {
        this.submitted = true;

        if (this.progressForm.invalid) {
            return;
        }

        this.buttonDisabled = true;
        for (const key in this.f) {
            if (key in this.f) {
                this.f[key].disable();
            }
        }

        this.projectsService.postProjectProgress(
            this.project.id,
            this.progressForm.value.milestone,
            this.progressForm.value.date)
        .subscribe(response => {
            console.log('Post Progress Response', response);
            this.router.navigate(['/projects']).then(result => {
                console.log('Router result = ', result);
                this.notifierService.show({
                    type: 'success',
                    message: 'El progreso del proyecto fue registrado exitosamente'
                });
            });
        }, error => {
            console.log(error);
            this.notifierService.show({
                type: 'error',
                message: 'Error registrando progreso'
            });
            this.buttonDisabled = false;
            for (const key in this.f) {
                if (key in this.f && key !== 'name') {
                    this.f[key].enable();
                }
            }
        });


    }

}
