import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Institution} from '../services/institution/institution.interface';
import {InstitutionService} from '../services/institution/institution.service';
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'app-institution-list',
  templateUrl: './institution-list.component.html',
  styleUrls: ['./institution-list.component.css']
})
export class InstitutionListComponent implements OnInit {
    search = '';
    isLoading = true;
    institutions: Institution[];


  constructor(private institutionService: InstitutionService, private notifierService: NotifierService) { }

  ngOnInit() {

      if (this.role !== 'Administrador' && this.role !== 'Consultor') {
          return this.notifierService.show({
              type: 'error',
              message: `Oops, parece que te has desviado. No tienes permiso para ver el contenido de esta página.
                     Te invitamos a visitar los que tienes disponibles haciendo click en una de las opciones que te
                     ofrecemos en la barra lateral`
          });
      }

      this.institutionService.getInstitutions().subscribe(response => {
          this.institutions = response;
          this.isLoading = false;
      });
  }

  get role() {
      return AuthService.getRole();
  }

}
