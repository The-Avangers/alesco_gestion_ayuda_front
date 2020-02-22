import { Component, OnInit } from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../login/login.component';
import {UserService} from '../services/user/user.service';
import {NotifierService} from 'angular-notifier';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostUser} from '../services/user/user.interface';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {
    notsame = true;
    isLoading = false;
    submitted = false;
    RegisterForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    lastname: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmed_password: new FormControl('', Validators.required)
  });

  constructor(private userService: UserService, private notifierService: NotifierService,
              private modalService: NgbModal, private router: Router) { }
  checkPasswords() {
    const pass = this.RegisterForm.get('password').value;
    const confirmPass = this.RegisterForm.get('confirmed_password').value;
    if (pass === confirmPass) {
        console.log('coinciden');
        this.notsame = false;
    } else {
        console.log('no coinciden');
    }
  }
    get f() { return this.RegisterForm.controls; }
    ngOnInit() {
      localStorage.removeItem('isAuthenticated');
      console.log('removed');
  }

  openAddUserModal() {
    const modalRef: NgbModalRef = this.modalService.open(LoginComponent, { centered: true });
    modalRef.componentInstance.isClient = true;
  }

  login() {
      this.submitted = true;
      if (this.RegisterForm.invalid || this.notsame) {
          const controls = this.RegisterForm.controls;
          for (const name in controls) {
              if (controls[name].invalid) {
                  console.log(name);
              }
          }
          console.log('negado');
          return;
      }
      console.log('pasó');
      this.isLoading = true
      const body: PostUser = {
          name : this.RegisterForm.value.name,
          lastname : this.RegisterForm.value.lastname,
          email : this.RegisterForm.value.email,
          role : 'Solicitante',
          password : this.RegisterForm.value.password
      };
      this.userService.postUser(body)
      .subscribe(response => {
          this.isLoading = false;
          console.log('Login Response', response);
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('token', response.headers.get('token'));
          localStorage.setItem('Role', response.body.role);
          localStorage.setItem('User', JSON.stringify(response.body));
          this.router.navigate(['/projects']).then();
      }, error => {
          this.isLoading = false;
          console.log(error);
          this.notifierService.show({
              type : 'error',
              message: 'Error al Registrar Usuario'
          });
          return;
      });
  }
}
