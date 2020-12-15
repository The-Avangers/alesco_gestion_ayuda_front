import { Component, OnInit } from '@angular/core';

import {User} from '../services/user/user.interface';
import {UserService} from '../services/user/user.service';
import {NotifierService} from 'angular-notifier';
import {filterTable, paginateObject} from '../utils';
import {PageEvent} from '@angular/material';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
    users: User[] = [];
    paginatedUsers: User[][] = [];
    currentPage: User[] = [];
    private pageSize = 10;
    search = '';
    role: string;
    isLoading = true;

    constructor(private service: UserService, private notifierService: NotifierService) {
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
        this.getUsers();
    }

    getUsers() {
        this.service.getUsers()
            .subscribe(response => {
                this.isLoading = false;
                this.users = response;
                this.paginatedUsers = paginateObject<User>(this.users, this.pageSize);
                this.currentPage = this.paginatedUsers[0];
            }, error => {
                this.isLoading = false;
                console.log(error.error);
                this.notifierService.show({
                    type : 'error',
                    message: 'Error al Obtener Los Usuarios'
                });
            });
    }

    searchTyped() {
        console.log(filterTable<User>(this.users, this.search));
        this.paginatedUsers = paginateObject<User>(filterTable<User>(this.users, this.search), this.pageSize);
        this.currentPage = this.paginatedUsers[0];
    }

    onPageChanged(event: PageEvent) {
        this.currentPage = this.paginatedUsers[event.pageIndex];
    }


    deleteUser(id: number) {
        console.log('id = ', id);
        this.service.deleteUser(id)
            .subscribe(() => {
                this.notifierService.show({
                    type : 'success',
                    message: 'Usuario borrado exitosamente'
                });
                this.isLoading = true;
                this.getUsers();
            });
    }

}
