import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../services/user/user.service';
import {NotifierService} from 'angular-notifier';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ChangeUserPassword} from '../services/user/user.interface';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
    submitted = false;
    isLoading = false;
    buttonDisabled = false;
    changePasswordForm = new FormGroup({
        oldPassword: new FormControl('', [Validators.required]),
        newPassword: new FormControl('', [Validators.required]),
        confirmPassword: new FormControl('', [Validators.required]),
    });

  constructor(private userService: UserService, private notifierService: NotifierService,
              private router: Router, private modalService: NgbModal) { }

    ngOnInit() {
    }

    checkPasswords() {
        this.submitted = true;
        console.log(this.changePasswordForm);
        console.log(this.f.oldPassword.errors);
        if (this.changePasswordForm.invalid) {
            return;
        }
        const pass = this.changePasswordForm.get('newPassword').value;
        const confirmPass = this.changePasswordForm.get('confirmPassword').value;
        if (pass === confirmPass) {
            this.changePassword();
        } else {
            this.notifierService.show({
                type : 'error',
                message: 'Las Contraseñas no Coinciden'
            });
            return;
        }
    }

  get f() {
      return this.changePasswordForm.controls;
  }

  changePassword() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.changePasswordForm.invalid) {
          return;
      }

      this.buttonDisabled = true;
      for (const key in this.changePasswordForm.controls) {
          if (key in this.changePasswordForm.controls) {
              this.changePasswordForm.controls[key].disable();
          }
      }

      const changePasswordBody: ChangeUserPassword = {
          oldPassword: this.changePasswordForm.value.oldPassword,
          newPassword: this.changePasswordForm.value.newPassword,
      };

      this.userService.changePassword(changePasswordBody)
          .subscribe(() => {
              localStorage.setItem('isAuthenticated', 'false');
              this.router.navigate(['/register']).then();
              this.notifierService.show({
                  type: 'success',
                  message: 'La contraseña fue cambiada exitosamente, inicie sesión nuevamente'
              });
              this.modalService.dismissAll();
          }, error => {
              this.isLoading = false;
              console.log(error);
              this.notifierService.show({
                  type : 'error',
                  message: error.error.Error,
              });

              this.buttonDisabled = false;
              for (const key in this.changePasswordForm.controls) {
                  if (key in this.changePasswordForm.controls) {
                      this.changePasswordForm.controls[key].enable();
                  }
              }
              return;
          });
  }

}
