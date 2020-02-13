import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

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
  constructor() { }
  ngOnInit() {
  }
    get f() { return this.LoginForm.controls; }
  login() {
      this.submitted = true;
      if (this.LoginForm.invalid) {
          console.log('negado')
          return;
      }
  }

}
