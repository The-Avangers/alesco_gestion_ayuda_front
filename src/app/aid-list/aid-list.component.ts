import { Component, OnInit } from '@angular/core';

import {Aid} from '../services/aid/aid.interface';
import {AidService} from '../services/aid/aid.service';
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'app-aid-list',
  templateUrl: './aid-list.component.html',
  styleUrls: ['./aid-list.component.css']
})
export class AidListComponent implements OnInit {
  aids: Aid[] = [];
  search = '';
  role: string;
  isLoading = true;

  constructor(private service: AidService, private notifierService: NotifierService) {
   }

  ngOnInit() {
      this.role = localStorage.getItem('Role');
      if (this.role !== 'Administrador' && this.role !== 'Consultor') {
          return this.notifierService.show({
              type: 'error',
              message: `Oops, parece que te has desviado. No tienes permiso para ver el contenido de esta página.
                     Te invitamos a visitar los que tienes disponibles haciendo click en una de las opciones que te
                     ofrecemos en la barra lateral`
          });
      }
      this.service.getAids()
            .subscribe(response => {
                this.isLoading = false;
                this.aids = response;
            }, error => {
                this.isLoading = false;
                console.log(error.error);
                this.notifierService.show({
                  type : 'error',
                  message: 'Error al Obtener Los Insumos'
                });
            });
  }

}
