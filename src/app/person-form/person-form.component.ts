import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NotifierService} from 'angular-notifier';
import {PersonService} from '../services/person/person.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Person} from '../services/person/person.interface';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css']
})
export class PersonFormComponent implements OnInit {
    edit = false;
    personId: number;
    isLoading = true;
    submitted = false;
    buttonDisabled = false;
    personForm = new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        ci: new FormControl('', [Validators.required]),
        phone: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
    });

  constructor(private notifierService: NotifierService, private personService: PersonService,
              private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
      if (this.role !== 'Administrador') {
          return this.notifierService.show({
              type: 'error',
              message: `Oops, parece que te has desviado. No tienes permiso para ver el contenido de esta página.
                     Te invitamos a visitar los que tienes disponibles haciendo click en una de las opciones que te
                     ofrecemos en la barra lateral`
          });
      }

      this.route.params.subscribe(params => {
          this.personId = parseInt(params.personId, 0);
          if (this.personId) {
              this.edit = true;
              this.personService.getPerson(this.personId).subscribe(response => {
                  this.f.firstName.setValue(response.firstName);
                  this.f.lastName.setValue(response.lastName);
                  this.f.ci.setValue(response.ci);
                  this.f.phone.setValue(response.phone);
                  this.f.email.setValue(response.email);
              });
          }
          this.isLoading = false;
      });
  }

  get role() {
      return AuthService.getRole();
  }

  get f() {
        return this.personForm.controls;
  }

  onSubmit() {
      this.submitted = true;

      if (this.personForm.invalid) {
          return;
      }
      this.buttonDisabled = true;
      for (const key in this.personForm.controls) {
          if (key in this.personForm.controls) {
              this.personForm.controls[key].disable();
          }
      }
      const body: Person = {
          firstName: this.personForm.value.firstName,
          lastName: this.personForm.value.lastName,
          ci: this.personForm.value.ci,
          phone: this.personForm.value.phone,
          email: this.personForm.value.email
      };

      if (!this.edit) {
          this.personService.postPerson(body).subscribe(response => {
              console.log('Post Person Response', response);
              this.router.navigate(['/projects/people']).then(result => {
                  console.log('Router result = ', result);
                  this.notifierService.show({
                      type: 'success',
                      message: 'La persona fue agregada exitosamente'
                  });
              });
          }, error => {
              console.log(error);
              this.notifierService.show({
                  type: 'error',
                  message: 'Error registrando persona'
              });
              this.buttonDisabled = false;
              for (const key in this.personForm.controls) {
                  if (key in this.personForm.controls) {
                      this.personForm.controls[key].enable();
                  }
              }
          });
      } else {
          console.log('Editando');
          this.personService.updatePerson(body, this.personId).subscribe(response => {
              console.log('Put Person Response', response);
              this.router.navigate(['/projects/people']).then(result => {
                  console.log('Router result = ', result);
                  this.notifierService.show({
                      type: 'success',
                      message: 'La persona fue editada exitosamente'
                  });
              });
          }, error => {
              console.log(error);
              this.notifierService.show({
                  type: 'error',
                  message: 'Error editando persona'
              });
              this.buttonDisabled = false;
              for (const key in this.personForm.controls) {
                  if (key in this.personForm.controls) {
                      this.personForm.controls[key].enable();
                  }
              }
          });
      }

  }
}
