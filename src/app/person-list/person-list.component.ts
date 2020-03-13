import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Person} from '../services/person/person.interface';
import {PersonService} from '../services/person/person.service';
import {NotifierService} from 'angular-notifier';
import {filterTable, paginateObject} from '../utils';
import {PageEvent} from '@angular/material';

@Component({
    selector: 'app-person-list',
    templateUrl: './person-list.component.html',
    styleUrls: ['./person-list.component.css']
})
export class PersonListComponent implements OnInit {
    isLoading = true;
    search = '';
    people: Person[];
    peoplePaginated: Person[][];
    currentPage: Person[];

    constructor(private personService: PersonService, private notifierService: NotifierService) {
    }

    ngOnInit() {
        if (this.role !== 'Administrador' && this.role !== 'Consultor') {
            return this.notifierService.show({
                type: 'error',
                message: `Oops, parece que te has desviado. No tienes permiso para ver el contenido de esta página.
                     Te invitamos a visitar los que tienes disponibles haciendo click en una de las opciones que te
                     ofrecemos en la barra lateral`
            });
        }

        this.personService.getPeople().subscribe(response => {
            this.people = response;
            this.peoplePaginated = paginateObject<Person>(this.people, 10);
            this.currentPage = this.peoplePaginated[0];
            this.isLoading = false;
        });

    }

    searchTyped() {
        this.peoplePaginated = paginateObject<Person>(filterTable<Person>(this.people, this.search), 10);
        this.currentPage = this.peoplePaginated[0];
    }

    get role() {
        return AuthService.getRole();
    }

    onPageChanged(event: PageEvent) {
        this.currentPage = this.peoplePaginated[event.pageIndex];
    }
}
