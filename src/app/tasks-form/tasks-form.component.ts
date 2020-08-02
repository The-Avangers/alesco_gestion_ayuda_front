import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {FullProject, Project} from '../services/project/project.interface';
import {ProjectsService} from '../services/project/projects.service';
import {ActivatedRoute, Router} from '@angular/router';
import {getDateString} from '../utils';
import {NotifierService} from 'angular-notifier';
import {Options} from 'select2';
import {Select2OptionData} from 'ng-select2';
import {TasksService} from '../services/task/tasks.service';
import {Task} from '../services/task/task.interface';

@Component({
    selector: 'app-progress-form',
    templateUrl: './tasks-form.component.html',
    styleUrls: ['./tasks-form.component.css']
})
export class TasksFormComponent implements OnInit {
    submitted = false;
    project: FullProject;
    task: Task;
    buttonDisabled = false;
    peopleInChargeOptions: Options;
    peopleInCharge: Select2OptionData[] = [];
    isLoading = true;
    completed = false;
    edit = false;
    taskId: number;
    progressForm = new FormGroup({
        projectName: new FormControl({value: '', disabled: false}, Validators.required),
        taskName: new FormControl('', Validators.required),
        description: new FormControl(''),
        peopleInCharge: new FormControl(''),
        completed: new FormControl(''),
        completionDate: new FormControl({value: '', disabled: true}),
    });

    constructor(private projectsService: ProjectsService, private tasksService: TasksService, private router: Router,
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

        this.peopleInChargeOptions = {
            multiple: true,
            width: '100%',
            placeholder: 'Seleccione los encargados...',
        };

        this.route.params.subscribe(params => {
            this.taskId = params.taskId;
            this.projectsService.getProjectById(params.projectId).subscribe(response => {
                this.project = response;
                this.project.peopleInvolved.map(value => {
                    if (value.role === 'encargado') {
                        const select2: Select2OptionData = {
                            id: value.id.toString(),
                            text: `(${value.ci}) ${value.firstName} ${value.lastName}`
                        };
                        this.peopleInCharge.push(select2);
                    }
                });
                this.f.projectName.setValue(this.project.name);
                this.f.projectName.disable();
                if (this.taskId) {
                    this.edit = true;
                    this.tasksService.getTaskById(this.taskId).subscribe(taskResponse => {
                        this.task = taskResponse;
                        this.f.taskName.setValue(this.task.name);
                        this.f.completed.setValue(this.task.completed);
                        this.f.description.setValue(this.task.description);
                        if (this.task.completed) {
                            let completionDateString: string | string[] = (this.task.completionDate as string).split('-');
                            completionDateString = completionDateString[0] + `-${completionDateString[1]}-` +
                                parseInt(completionDateString[2], 0).toString();
                            console.log(completionDateString);
                            this.f.completionDate.setValue(getDateString(new Date(completionDateString)));
                        }
                        if (this.task.people) {
                            this.f.peopleInCharge.setValue(this.task.people.map(value => value.id.toString()));
                        }
                        console.log('People value', this.f.peopleInCharge.value);
                        this.isLoading = false;
                    }, error => this.isLoading = false);
                } else  {
                    this.isLoading = false;
                }
            }, error => this.isLoading = false);
        });

    }

    getMaxProgressDate() {
        let maxDate: Date;
        maxDate = new Date();
        maxDate.setDate(maxDate.getDate());
        return getDateString(maxDate);
    }

    get f() {
        return this.progressForm.controls;
    }

    get role() {
        return AuthService.getRole();
    }

    checkBoxClicked() {
        this.completed = this.f.completed.value;
        console.log(this.completed);
        if (this.completed) {
            console.log('completed');
            this.f.completionDate.enable();
            this.f.peopleInCharge.setValidators(Validators.required);
            this.f.completionDate.setValidators(Validators.required);
        } else {
            this.f.completionDate.disable();
            this.f.peopleInCharge.clearValidators();
            this.f.completionDate.clearValidators();
        }
        this.f.peopleInCharge.updateValueAndValidity();
        this.f.completionDate.updateValueAndValidity();
    }

    onSubmit() {
        console.log( this.f.completionDate.errors );
        console.log('Submitting');
        this.submitted = true;
        if (this.progressForm.invalid) {
            console.log('invalid');
            return;
        }

        this.buttonDisabled = true;
        for (const key in this.f) {
            if (key in this.f) {
                this.f[key].disable();
            }
        }

        const peopleInCharge = this.progressForm.value.peopleInCharge ? this.progressForm.value.peopleInCharge : [];
        console.log(peopleInCharge);
        const body = {
            name: this.progressForm.value.taskName,
            projectId: this.project.id,
            completed: !!this.progressForm.value.completed,
            completionDate: this.progressForm.value.completionDate || undefined,
            description: this.progressForm.value.description || undefined,
            people: peopleInCharge.map((value: string) => parseInt(value, 0) )
        };


        console.log('router = ', this.router);
        if (this.edit) {
            this.tasksService.putTask(this.task.id, body).subscribe(response => this.handleResults(response),
                    error => this.handleError(error));
        } else {
            this.tasksService.postTask(body).subscribe(response => this.handleResults(response),
                error => this.handleError(error));
        }
    }

    private handleResults(response: Task) {
        console.log('Router', this.router);
        console.log('Task Response', response);
        this.router.navigate(['projects', this.project.id, 'tasks']).then(result => {
            this.notifierService.show({
                type: 'success',
                message: this.edit ? 'La tarea fue editada exitosamente' : 'La tarea fue agregada exitosamente'
            });
        });
    }

    private handleError(error: Error) {
        console.log(error);
        this.notifierService.show({
            type: 'error',
            message: this.edit ? 'Error editando tarea' : 'Error creando tarea'
        });
        this.buttonDisabled = false;
        for (const key in this.f) {
            if (key in this.f && key !== 'projectName') {
                this.f[key].enable();
            }
        }
    }

}

