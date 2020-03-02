import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Institution} from '../services/institution/institution.interface';
import {InstitutionService} from '../services/institution/institution.service';

@Component({
  selector: 'app-institution-list',
  templateUrl: './institution-list.component.html',
  styleUrls: ['./institution-list.component.css']
})
export class InstitutionListComponent implements OnInit {
    search = '';
    isLoading = true;
    institutions: Institution[];


  constructor(private institutionService: InstitutionService) { }

  ngOnInit() {
      this.institutionService.getInstitutions().subscribe(response => {
          this.institutions = response;
          this.isLoading = false;
      });
  }

  get role() {
      return AuthService.getRole();
  }

}
