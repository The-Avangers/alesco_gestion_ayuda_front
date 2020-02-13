import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Login} from '../services/user/user.interface';
import {UserService} from '../services/user/user.service';

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
  constructor(private loginService: UserService) { }
  ngOnInit() {
  }
    get f() { return this.LoginForm.controls; }
  login() {
      this.submitted = true;
      if (this.LoginForm.invalid) {
          console.log('negado')
          return;
      }
      const body: Login = {
          email : this.LoginForm.value.email,
          password : this.LoginForm.value.password
      };
      this.loginService.postLogin(body)
          .subscribe(response => {
              console.log('Login Response', response);
          })

  }

}
