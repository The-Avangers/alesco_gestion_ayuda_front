import { Component, OnInit } from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {
    notsame = true;
    submitted = false;
    RegisterForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    lastname: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmed_password: new FormControl('', Validators.required)
  });

  constructor(private modalService: NgbModal, private router: Router) { }
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
      if (this.RegisterForm.invalid) {
          console.log('negado')
          return;
      }
      console.log('pasó');
      localStorage.setItem('isAuthenticated', 'true');
      this.router.navigate(['/']).then();
  }
}
