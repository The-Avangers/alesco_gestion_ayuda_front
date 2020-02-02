import { Component, OnInit } from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {

  constructor(private modalService: NgbModal, private router: Router) { }

  ngOnInit() {
      localStorage.removeItem('isAuthenticated');
      console.log('removed');
  }

  openAddUserModal() {
    const modalRef: NgbModalRef = this.modalService.open(LoginComponent, { centered: true });
    modalRef.componentInstance.isClient = true;
  }

  login() {
      localStorage.setItem('isAuthenticated', 'true');
      this.router.navigate(['/']).then();
  }

}
