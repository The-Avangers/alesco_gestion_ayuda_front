import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NotifierService} from 'angular-notifier';
import {Router} from '@angular/router';
import {AidService} from '../services/aid/aid.service';
import {PostAid} from '../services/aid/aid.interface';

@Component({
  selector: 'app-aid-form',
  templateUrl: './aid-form.component.html',
  styleUrls: ['./aid-form.component.css']
})
export class AidFormComponent implements OnInit {
    aidForm: FormGroup;
    typeOptions: string;
    types: string[];
    role: string;
    submitted = false;
    buttonDisabled = false;

    constructor(private aidService: AidService, private notifierService: NotifierService,
                private router: Router) {
    }

    ngOnInit() {
        this.role = localStorage.getItem('Role');
        if (this.role !== 'Administrador') {
            return this.notifierService.show({
                type: 'error',
                message: `Oops, parece que te has desviado. No tienes permiso para ver el contenido de esta página.
                     Te invitamos a visitar los que tienes disponibles haciendo click en una de las opciones que te
                     ofrecemos en la barra lateral`
            });
        }
        this.aidForm = new FormGroup({
            name : new FormControl('', [Validators.required, Validators.maxLength(20)]),
            measure : new FormControl('', [Validators.required, Validators.maxLength(20)]),
            type : new FormControl('', [Validators.required, Validators.maxLength(20)]),
            unit : new FormControl('', [Validators.required])
        });
        this.types = ['Medicina', 'Alimento', 'Limpieza'];
    }
    get f() {
        return this.aidForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        if (this.aidForm.invalid) {
            return;
        }
        this.buttonDisabled = true;
        for (const key in this.aidForm.controls) {
            if (key in this.aidForm.controls) {
                this.aidForm.controls[key].disable();
            }
        }
        const body: PostAid = {
            name: this.aidForm.value.name,
            measure: this.aidForm.value.measure,
            type: this.aidForm.value.type,
            unit: this.aidForm.value.unit
        };
        console.log('Post body = ', body);
        this.aidService.postAids(body)
            .subscribe(response => {
                console.log('Post Aid Response', response);
                this.router.navigate(['/aids']).then(result => {
                    console.log('Router result = ', result);
                    this.notifierService.show({
                        type: 'success',
                        message: 'El insumo fue creado exitosamente'
                    });
                });
            }, error => {
                console.log(error);
                this.notifierService.show({
                    type: 'error',
                    message: 'Error registrando insumo'
                });
            });
    }

    typeChanged(data: { value: string }) {
        this.aidForm.controls.type.setValue(data.value);
    }
}
