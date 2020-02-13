import {Component, OnInit} from '@angular/core';
import {InstitutionService} from '../services/institution/institution.service';
import {ProjectsService} from '../services/project/projects.service';
import {PersonService} from '../services/person/person.service';
import {Select2OptionData} from 'ng2-select2';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PostProject} from '../services/project/project.interface';
import {NotifierService} from 'angular-notifier';
import {Router} from '@angular/router';
import {getDateString} from '../utils';

@Component({
    selector: 'app-project-form',
    templateUrl: './project-form.component.html',
    styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
    projectForm: FormGroup;
    institutionOptions: Select2Options;
    institutions: Select2OptionData[];
    people: Select2OptionData[];
    peopleInCharge: Select2OptionData[];
    peopleConcerned: Select2OptionData[];
    peopleInChargeOptions: Select2Options;
    personConcernedOptions: Select2Options;
    peopleInChargeCurrent: number[];
    private now = new Date();
    submitted = false;
    endDateMinValue: string;
    endDateValue: string;
    role: string;

    constructor(private projectsService: ProjectsService, private institutionsService: InstitutionService,
                private peopleService: PersonService, private formBuilder: FormBuilder,
                private notifierService: NotifierService, private router: Router) {
    }

    ngOnInit() {
        this.role = localStorage.getItem('Role');
        this.projectForm = this.formBuilder.group({
            name: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: [{value: '', disabled: true}, Validators.required],
            institution: ['', Validators.required],
            peopleInCharge: ['', Validators.required],
            personConcerned: ['', Validators.required],
            price: ['', [Validators.required]],
        });
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
            placeholder: 'Seleccione interesado...',
        };

        this.institutionOptions = {
            width: '100%',
            placeholder: 'Seleccione institución...'
        };
    }

    get f() {
        return this.projectForm.controls;
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.projectForm.invalid) {
            return;
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

    peopleInChargeChanged(data: {value: string[]}) {
        console.log(data);
        this.peopleInChargeCurrent = data.value.map(value => parseInt(value, 0));
        this.projectForm.controls.peopleInCharge.setValue(this.peopleInChargeCurrent);
        console.log(this.peopleInChargeCurrent);
    }

    personConcernedChanged(data: {value: string}) {
        console.log(data);
        this.projectForm.controls.personConcerned.setValue(parseInt(data.value, 0) );
        const aux: Select2OptionData[] = [];
        for (const person of this.people) {
            if (person.id !== data.value) {
                aux.push(person);
            }
        }
        this.peopleInCharge = aux;
        console.log(this.peopleInCharge);
    }

    institutionChanged(data: {value: string}) {
        this.projectForm.controls.institution.setValue(parseInt(data.value, 0));
    }

    startDateChanged(data: {srcElement: {value: string}}) {
        if (data.srcElement.value) {
            console.log(data.srcElement.value);
            this.projectForm.controls.endDate.enable();
            const dateAux = new Date(data.srcElement.value);
            dateAux.setDate(dateAux.getDate() + 2);
            this.endDateMinValue = getDateString(dateAux);
            console.log('Min endDate = ', this.endDateMinValue);
            if (this.projectForm.controls.endDate.value) {
                const endDateValue =  new Date(this.projectForm.controls.endDate.value);
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
