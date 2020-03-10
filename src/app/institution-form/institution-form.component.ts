import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {InstitutionService} from '../services/institution/institution.service';
import {NotifierService} from 'angular-notifier';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-institution-form',
    templateUrl: './institution-form.component.html',
    styleUrls: ['./institution-form.component.css']
})
export class InstitutionFormComponent implements OnInit {
    institutionForm = new FormGroup({
        name: new FormControl('', [Validators.required])
    });
    edit = false;
    isLoading = true;
    submitted = false;
    buttonDisabled = false;
    institutionId: number;


    constructor(private institutionService: InstitutionService, private notifierService: NotifierService,
                private route: ActivatedRoute, private router: Router) {

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
            this.institutionId = parseInt(params.institutionId, 0);
            if (this.institutionId) {
                this.edit = true;
                this.institutionService.getInstitution(this.institutionId).subscribe(response => {
                    console.log(response);
                    this.f.name.setValue(response.name);
                });
            }
            this.isLoading = false;
        });
    }

    get role() {
        return AuthService.getRole();
    }

    get f() {
        return this.institutionForm.controls;
    }

    onSubmit() {
        this.submitted = true;

        if (this.institutionForm.invalid) {
            return;
        }
        this.buttonDisabled = true;
        for (const key in this.institutionForm.controls) {
            if (key in this.institutionForm.controls) {
                this.institutionForm.controls[key].disable();
            }
        }

        if (this.edit) {
            this.institutionService.updateInstitution(this.institutionForm.value.name, this.institutionId).subscribe(response => {
                console.log('Put Institution Response', response);
                this.router.navigate(['/projects/institutions']).then(result => {
                    console.log('Router result = ', result);
                    this.notifierService.show({
                        type: 'success',
                        message: 'La institución fue editada exitosamente'
                    });
                });
            }, error => {
                console.log(error);
                this.notifierService.show({
                    type: 'error',
                    message: 'Error editando institucion'
                });
                this.buttonDisabled = false;
                for (const key in this.institutionForm.controls) {
                    if (key in this.institutionForm.controls) {
                        this.institutionForm.controls[key].enable();
                    }
                }
            });
        } else {
            this.institutionService.postInstitution(this.institutionForm.value.name).subscribe(response => {
                console.log('Post Institution Response', response);
                this.router.navigate(['/projects/institutions']).then(result => {
                    console.log('Router result = ', result);
                    this.notifierService.show({
                        type: 'success',
                        message: 'La institución fue agregada exitosamente'
                    });
                });
            }, error => {
                console.log(error);
                this.notifierService.show({
                    type: 'error',
                    message: 'Error agregando institucion'
                });
                this.buttonDisabled = false;
                for (const key in this.institutionForm.controls) {
                    if (key in this.institutionForm.controls) {
                        this.institutionForm.controls[key].enable();
                    }
                }
            });
        }
    }
}
