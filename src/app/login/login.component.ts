import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Login, User} from '../services/user/user.interface';
import {UserService} from '../services/user/user.service';
import {NotifierService} from 'angular-notifier';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    submitted = false;
    isLoading = true;
    LoginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required])
    });

    constructor(private loginService: UserService, private notifierService: NotifierService,
                private router: Router, private modalService: NgbModal) {
    }

    ngOnInit() {
    }

    get f() {
        return this.LoginForm.controls;
    }

    login() {
        this.submitted = true;
        if (this.LoginForm.invalid) {
            const controls = this.LoginForm.controls;
            for (const name in controls) {
                if (controls[name].invalid) {
                    console.log(name);
                }
            }
            console.log('negado');
            return;
        }
        const body: Login = {
            email: this.LoginForm.value.email,
            password: this.LoginForm.value.password
        };
        this.loginService.postLogin(body)
            .subscribe(response => {
                this.isLoading = false;
                console.log('Login Response', response);
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('token', response.headers.get('token'));
                localStorage.setItem('Role', response.body.role);
                localStorage.setItem('User', JSON.stringify(response.body));
                this.router.navigate(['/projects']).then();
                this.modalService.dismissAll();
            }, error => {
                this.isLoading = false;
                let errorMessage = 'Servicio No Responde';
                if (JSON.stringify(error.error) === '{"Error":"Usuario No Registrado"}') {
                    errorMessage = 'Usuario No Encontrado';
                }
                if (JSON.stringify(error.error) === '{"Error":"Clave Inválida, Intente Nuevamente"}') {
                    errorMessage = 'Clave Inválida';
                }
                console.log(error);
                this.notifierService.show({
                    type : 'error',
                    message: errorMessage
                });
                this.isLoading = true;
                return;
            });
    }
}
