import {Component, OnInit} from '@angular/core';
import {InstitutionService} from '../services/institution/institution.service';
import {ProjectsService} from '../services/project/projects.service';
import {PersonService} from '../services/person/person.service';
import {Select2OptionData} from 'ng2-select2';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-project-form',
    templateUrl: './project-form.component.html',
    styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
    projectForm: FormGroup;
    peopleOptions: Select2Options;
    institutionOptions: Select2Options;
    institutions: Select2OptionData[];
    people: Select2OptionData[];
    peopleInvolvedCurrent: string;
    private now = new Date();
    submitted = false;
    endDateMinValue: string;
    endDateValue: string;

    constructor(private projectsService: ProjectsService, private institutionsService: InstitutionService,
                private peopleService: PersonService, private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.projectForm = this.formBuilder.group({
            name: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: [{value: '', disabled: true}, Validators.required],
            institution: ['', Validators.required],
            peopleInvolved: ['', Validators.required],
            personInCharge: ['', Validators.required],
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
        });
        console.log(this.projectForm.controls.personInCharge.value);
        this.peopleOptions = {
            multiple: true,
        };

        this.institutionOptions = {
            width: '225'
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

        alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.projectForm.value));
    }

    getMinStartDate() {
        const month = (this.now.getMonth() + 1) >= 10 ? this.now.getMonth() + 1 : `0${this.now.getMonth() + 1}`;
        return `${this.now.getFullYear()}-${month}-${this.now.getDate()}`;
    }

    peopleInvolvedChanged(data: {value: string[]}) {
        console.log(data);
        this.peopleInvolvedCurrent = data.value.join(' | ');
        this.projectForm.controls.peopleInvolved.setValue(this.peopleInvolvedCurrent);
        console.log(this.peopleInvolvedCurrent);
    }

    personInChargeChanged(data: {value: string}) {
        console.log(data);
        this.projectForm.controls.personInCharge.setValue(data.value);
    }

    startDateChanged(data: {srcElement: {value: string}}) {
        if (data.srcElement.value) {
            console.log(data.srcElement.value);
            this.projectForm.controls.endDate.enable();
            this.endDateMinValue = data.srcElement.value;
        } else {
            this.projectForm.controls.endDate.disable();
            this.endDateValue = null;
        }
    }

}
