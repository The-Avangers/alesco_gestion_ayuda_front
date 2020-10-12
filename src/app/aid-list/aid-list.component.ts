import { Component, OnInit } from '@angular/core';

import {Aid} from '../services/aid/aid.interface';
import {AidService} from '../services/aid/aid.service';
import {NotifierService} from 'angular-notifier';
import {filterTable, paginateObject} from '../utils';
import {PageEvent} from '@angular/material';

@Component({
  selector: 'app-aid-list',
  templateUrl: './aid-list.component.html',
  styleUrls: ['./aid-list.component.css']
})
export class AidListComponent implements OnInit {
  aids: Aid[] = [];
  paginatedAids: Aid[][] = [];
  currentPage: Aid[] = [];
  private pageSize = 10;
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
                this.paginatedAids = paginateObject<Aid>(this.aids, this.pageSize);
                this.currentPage = this.paginatedAids[0];
            }, error => {
                this.isLoading = false;
                console.log(error.error);
                this.notifierService.show({
                  type : 'error',
                  message: 'Error al Obtener Los Insumos'
                });
            });
  }

    searchTyped() {
        console.log(filterTable<Aid>(this.aids, this.search));
        this.paginatedAids = paginateObject<Aid>(filterTable<Aid>(this.aids, this.search), this.pageSize);
        this.currentPage = this.paginatedAids[0];
    }

    onPageChanged(event: PageEvent) {
        this.currentPage = this.paginatedAids[event.pageIndex];
    }

}
