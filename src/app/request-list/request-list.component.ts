import { Component, OnInit } from '@angular/core';

import {RequestService} from '../services/request/request.service';
import {Request} from '../services/request/request.interface';
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})
export class RequestListComponent implements OnInit {
    requests: Request[] = [];
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
    isLoading = true;

  constructor(private service: RequestService, private notifierService: NotifierService) { }

  ngOnInit() {
      this.role = localStorage.getItem('Role');
      if (this.role !== 'Administrador' && this.role !== 'Solicitante') {
          return this.notifierService.show({
              type: 'error',
              message: `Oops, parece que te has desviado. No tienes permiso para ver el contenido de esta página.
                     Te invitamos a visitar los que tienes disponibles haciendo click en una de las opciones que te
                     ofrecemos en la barra lateral`
          });
      }
      this.service.getRequests()
          .subscribe(response => {
              this.isLoading = false;
              this.requests = response;
              this.requests = this.requests.map(value => {
                  const date = new Date(value.created_at);
                  // @ts-ignore
                  value.created_at = `${date.getDate()} de ${this.months[date.getMonth()]} de ${date.getFullYear()}`;
                  return value;
              });
          }, error => {
              this.isLoading = false;
              console.log(error.error);
              this.notifierService.show({
                  type : 'error',
                  message: 'Error al Obtener Las Solicitudes'
              });
          });
  }


}
