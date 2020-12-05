import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../services/user/user.service';
import {NotifierService} from 'angular-notifier';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {LoginComponent} from '../login/login.component';
import {PostUser} from '../services/user/user.interface';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
    notsame = true;
    role: string;
    roleOptions: string;
    roles: string[];
    isLoading = false;
    submitted = false;
    userForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.maxLength(20)]),
        lastname: new FormControl('', [Validators.required, Validators.maxLength(20)]),
        email: new FormControl('', [Validators.required, Validators.email]),
        role: new FormControl('', [Validators.required, Validators.maxLength(20)]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        confirmed_password: new FormControl('', Validators.required)
    });

    constructor(private userService: UserService, private notifierService: NotifierService,
                private modalService: NgbModal, private router: Router) { }
    checkPasswords() {
        if (this.userForm.invalid) {
            return;
        }
        const pass = this.userForm.get('password').value;
        const confirmPass = this.userForm.get('confirmed_password').value;
        if (pass === confirmPass) {
            this.submit();
        } else {
            this.notifierService.show({
                type : 'error',
                message: 'Las Contraseñas no Coinciden'
            });
            return;
        }
    }
    get f() { return this.userForm.controls; }
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
        this.roles = ['Administrador', 'Solicitante', 'Consultor'];
    }

    roleChanged(data: { value: string }) {
        this.userForm.controls.role.setValue(data.value);
    }

    submit() {
        this.submitted = true;
        this.isLoading = true;
        const body: PostUser = {
            name : this.userForm.value.name,
            lastname : this.userForm.value.lastname,
            email : this.userForm.value.email,
            role : this.userForm.value.role,
            password : this.userForm.value.password
        };
        this.userService.createUser(body)
            .subscribe(response => {
                this.isLoading = false;
                this.router.navigate(['/users']).then(result => {
                    console.log('Router result = ', result);
                    this.notifierService.show({
                        type: 'success',
                        message: 'El Usuario fue Creado Exitosamente'
                    });
                });
            }, error => {
                this.isLoading = false;
                console.log(error);
                this.notifierService.show({
                    type : 'error',
                    message: 'Error al Crear el Usuario'
                });
                return;
            });
    }
}
