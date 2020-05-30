import { Component, OnInit } from '@angular/core';
import {RequestService} from '../services/request/request.service';
import {AidService} from '../services/aid/aid.service';
import {Options} from 'select2';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NotifierService} from 'angular-notifier';
import {Router} from '@angular/router';
import {Select2OptionData} from 'ng-select2';
import {PostRequest} from '../services/request/request.interface';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css']
})
export class RequestFormComponent implements OnInit {
    requestForm = new FormGroup({
        aid: new FormControl('', [Validators.required])
    });
    role: string;
    id: number;
    aidOptions: Options;
    aids: Select2OptionData[];
    submitted = false;
    buttonDisabled = false;
    isLoading = true;

  constructor(private aidService: AidService, private notifierService: NotifierService, private requestService: RequestService,
              private router: Router) { }

  ngOnInit() {
      this.role = localStorage.getItem('Role');
      this.id = JSON.parse(localStorage.getItem('User')).id;
      if (this.role !== 'Solicitante') {
          return this.notifierService.show({
              type: 'error',
              message: `Oops, parece que te has desviado. No tienes permiso para ver el contenido de esta página.
                     Te invitamos a visitar los que tienes disponibles haciendo click en una de las opciones que te
                     ofrecemos en la barra lateral`
          });
      }
      this.aidOptions = {
          width: '100%',
          placeholder: {id: '', text: 'Seleccione Insumo...'}
      };
      this.getSelectAids().then(() => {
          this.isLoading = false;
      });
  }

  async getSelectAids() {
      this.aids = (await this.aidService.getAidsAvailable().toPromise()).map(value => {
          const select2: Select2OptionData = {
              id: value.id.toString(),
              text: value.name + ' ' + value.measure
          };
          return select2;
      });
  }

    get f() {
        return this.requestForm.controls;
    }

  onSubmit() {
    this.submitted = true;
    if (this.requestForm.invalid) {
        return;
    }
    this.buttonDisabled = true;
    const body: PostRequest = {
        id_user:  this.id,
        id_aid:  this.requestForm.value.aid,
    };
    this.requestService.postRequest(body)
        .subscribe(response => {
            console.log('Post Project Response', response);
            this.router.navigate(['/requests']).then(result => {
                console.log('Router result = ', result);
                this.notifierService.show({
                    type: 'success',
                    message: 'La solicitud fue creada exitosamente'
                });
            });
        }, error => {
            console.log(error);
            this.notifierService.show({
                type: 'error',
                message: 'Error al Registrar la Solicitud'
            });
        });
  }

  aidChanged(data: { value: string }) {
        this.requestForm.controls.aid.setValue(data.value);
  }

}
