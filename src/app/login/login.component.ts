import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Login, User} from '../services/user/user.interface';
import {UserService} from '../services/user/user.service';
import {NotifierService} from 'angular-notifier';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    submitted = false;
    LoginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required])
    });

    constructor(private loginService: UserService, private notifierService: NotifierService,
                private router: Router) {
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
                console.log('Login Response', response);
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('Role', response.role);
                this.router.navigate(['/projects']).then();
            }, error => {
                console.log(error);
                this.notifierService.show({
                    type : 'error',
                    message: 'Credenciales Inválidas'
                });
                return;
            });
    }
}
