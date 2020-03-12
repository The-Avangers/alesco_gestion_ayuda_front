import { Component, OnInit } from '@angular/core';
import {FullProject} from '../services/project/project.interface';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ProjectsService} from '../services/project/projects.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {getDateString} from '../utils';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit {
    isLoading = true;
    submitted = false;
    project: FullProject;
    price: number;
    buttonDisabled = false;
    paymentForm = new FormGroup({
        name: new FormControl('', Validators.required),
        payment: new FormControl('', Validators.required),
        totalAmount: new FormControl('', Validators.required),
        date: new FormControl('', Validators.required),
        fullPayment: new FormControl('')
    });

    constructor(private projectsService: ProjectsService, private router: Router,
                private route: ActivatedRoute, private notifierService: NotifierService) {
    }

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
            this.projectsService.getProjectById(params.projectId).subscribe(response => {
                this.project = response;
                this.price = this.project.price;
                for (const payment of this.project.payments) {
                    this.price -= payment.amount;
                }
                this.f.payment.setValidators([Validators.required, Validators.max(this.price)]);
                this.f.name.setValue(this.project.name);
                this.f.totalAmount.setValue(this.price);
                this.f.totalAmount.disable();
                this.f.name.disable();
                this.f.fullPayment.setValue(false);
                this.isLoading = false;
            });
        });

    }

    getMinPaymentDate() {
        let minDate: Date;
        if (this.project.payments.length === 0) {
            minDate = new Date(this.project.startDate);
            minDate.setDate(minDate.getDate() + 1);
        } else {
            minDate = new Date(this.project.payments[this.project.payments.length - 1].date);
            minDate.setDate(minDate.getDate());
        }
        return getDateString(minDate);
    }

    get f() {
        return this.paymentForm.controls;
    }

    get role() {
        return AuthService.getRole();
    }

    checkBoxClicked() {
        const fullPay = this.f.fullPayment.value;
        if (fullPay) {
            this.f.payment.setValue(this.price);
            this.f.payment.disable();
        } else {
            this.f.payment.enable();
        }
    }

    onSubmit() {
        this.submitted = true;
        if (this.paymentForm.invalid) {
            return;
        }

        this.buttonDisabled = true;
        for (const key in this.f) {
            if (key in this.f) {
                this.f[key].disable();
            }
        }

        this.projectsService.postProjectPayment(
            this.project.id,
            this.paymentForm.value.payment,
            this.paymentForm.value.date)
            .subscribe(response => {
                console.log('Post Payment Response', response);
                this.router.navigate(['/projects']).then(result => {
                    console.log('Router result = ', result);
                    this.notifierService.show({
                        type: 'success',
                        message: 'El pago del proyecto fue registrado exitosamente'
                    });
                });
            }, error => {
                console.log(error);
                this.notifierService.show({
                    type: 'error',
                    message: 'Error registrando pago'
                });
                this.buttonDisabled = false;
                for (const key in this.f) {
                    if (key in this.f && key !== 'name') {
                        this.f[key].enable();
                    }
                }
            });


    }
}
