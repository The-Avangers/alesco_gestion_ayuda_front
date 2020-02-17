import {Component, OnInit} from '@angular/core';
import {InstitutionService} from '../services/institution/institution.service';
import {ProjectsService} from '../services/project/projects.service';
import {PersonService} from '../services/person/person.service';
import {Select2OptionData} from 'ng-select2';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PostProject} from '../services/project/project.interface';
import {NotifierService} from 'angular-notifier';
import {Router} from '@angular/router';
import {getDateString} from '../utils';
import {AuthService} from '../services/auth.service';
import {Options} from 'select2';

@Component({
    selector: 'app-project-form',
    templateUrl: './project-form.component.html',
    styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
    projectForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl({value: '', disabled: true}, [Validators.required]),
    institution: new FormControl('', [Validators.required]),
    peopleInCharge: new FormControl('', [Validators.required]),
    personConcerned: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
});
    institutionOptions: Options;
    institutions: Select2OptionData[];
    people: Select2OptionData[];
    peopleInCharge: Select2OptionData[];
    peopleConcerned: Select2OptionData[];
    peopleInChargeOptions: Options;
    personConcernedOptions: Options;
    peopleInChargeCurrent: number[] = [];
    private now = new Date();
    submitted = false;
    endDateMinValue: string;
    endDateValue: string;
    buttonDisabled = false;
    startValue: string[];

    constructor(private projectsService: ProjectsService, private institutionsService: InstitutionService,
                private peopleService: PersonService, private formBuilder: FormBuilder,
                private notifierService: NotifierService, private router: Router) {
    }

    get role(): string {
        return AuthService.getRole();
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
        this.institutionsService.getInstitutions().subscribe(response => {
            console.log(response);
            this.institutions = response.map(value => {
                const select2: Select2OptionData = {
                    id: value.id.toString(),
                    text: value.name
                };
                return select2;
            });
        });

        this.peopleService.getPeople().subscribe(response => {
            this.people = response.map(value => {
                const select2: Select2OptionData = {
                    id: value.id.toString(),
                    text: `(${value.ci}) ${value.firstName} ${value.lastName}`,
                };
                return select2;
            });
            this.peopleInCharge = this.people.map(value => value);
            this.peopleConcerned = this.people.map(value => value);
        });

        this.peopleInChargeOptions = {
            multiple: true,
            width: '100%',
            placeholder: 'Seleccione los encargados...',
        };
        this.personConcernedOptions = {
            width: '100%',
            placeholder: {id: '', text: 'Seleccione interesado...'}
        };

        this.institutionOptions = {
            width: '100%',
            placeholder: 'Seleccione institución...'
        };

        // this.people.unshift({id: '0', text: 'Empty'});
    }

    get f() {
        return this.projectForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        console.log(this.f.personConcerned.value);

        // stop here if form is invalid
        if (this.projectForm.invalid) {
            return;
        }

        this.buttonDisabled = true;
        for (const key in this.projectForm.controls) {
            if (key in this.projectForm.controls) {
                this.projectForm.controls[key].disable();
            }
        }
        const body: PostProject = {
            name: this.projectForm.value.name,
            startDate: this.projectForm.value.startDate,
            endDate: this.projectForm.value.endDate,
            institutionId: this.projectForm.value.institution,
            people: [{
                id: this.projectForm.value.personConcerned,
                role: 'Interesado',
            }],
            price: this.projectForm.value.price,
        };

        for (const personId of this.projectForm.value.peopleInCharge) {
            body.people.push({
                id: personId,
                role: 'Encargado',
            });
        }

        console.log('Post body = ', body);
        this.projectsService.postProjects(body)
            .subscribe(response => {
                console.log('Post Project Response', response);
                this.router.navigate(['/projects']).then(result => {
                    console.log('Router result = ', result);
                    this.notifierService.show({
                        type: 'success',
                        message: 'El proyecto fue creado exitosamente'
                    });
                });
            }, error => {
                console.log(error);
                this.notifierService.show({
                    type: 'error',
                    message: 'Error registrando proyecto'
                });
            });

    }


    getMinStartDate() {
        return getDateString(this.now);
    }

    peopleInChargeChanged(data: string[]) {
        console.log(data);
        this.peopleInChargeCurrent = data.map(value => parseInt(value, 0));
        // this.projectForm.controls.peopleInCharge.setValue(this.peopleInChargeCurrent);
        console.log(this.peopleInChargeCurrent);
    }

    personConcernedChanged(data: string) {
        console.log(typeof data);
        // this.projectForm.controls.personConcerned.setValue(parseInt(data.value, 0) || null);
        const aux: Select2OptionData[] = [];
        if (this.peopleInChargeCurrent.includes(parseInt(data, 0))) {
            this.peopleInChargeCurrent.splice(this.peopleInChargeCurrent.indexOf(parseInt(data, 0)), 1);
        }
        console.log(this.projectForm.controls.personConcerned.value);
        this.projectForm.controls.peopleInCharge.setValue(this.peopleInChargeCurrent.map(value => value.toString()) );
        for (const person of this.people) {
            if (person.id !== data) {
                aux.push(person);
            }
        }
        this.peopleInCharge = aux;
        console.log(this.peopleInCharge);
    }

    institutionChanged(data: { value: string }) {
        // this.projectForm.controls.institution.setValue(parseInt(data.value, 0));
    }

    startDateChanged(data: { srcElement: { value: string } }) {
        if (data.srcElement.value) {
            console.log(data.srcElement.value);
            this.projectForm.controls.endDate.enable();
            const dateAux = new Date(data.srcElement.value);
            dateAux.setDate(dateAux.getDate() + 2);
            this.endDateMinValue = getDateString(dateAux);
            console.log('Min endDate = ', this.endDateMinValue);
            if (this.projectForm.controls.endDate.value) {
                const endDateValue = new Date(this.projectForm.controls.endDate.value);
                const startDateValue = new Date(data.srcElement.value);
                if (startDateValue > endDateValue) {
                    this.projectForm.controls.endDate.setValue(null);
                }
            }
        } else {
            console.log(data.srcElement.value);
            this.projectForm.controls.endDate.disable();
            this.projectForm.controls.endDate.setValue(null);
            this.endDateValue = null;
        }
    }

}
