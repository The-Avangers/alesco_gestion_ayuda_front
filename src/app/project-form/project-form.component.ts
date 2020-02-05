import {Component, OnInit} from '@angular/core';
import {Institution} from '../services/institution/institution.interface';
import {InstitutionService} from '../services/institution/institution.service';
import {ProjectsService} from '../services/project/projects.service';
import {Select2OptionData} from 'ng2-select2';

@Component({
    selector: 'app-project-form',
    templateUrl: './project-form.component.html',
    styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {

    institutions: Select2OptionData[];

    constructor(private projectsService: ProjectsService, private institutionsService: InstitutionService) {
    }

    ngOnInit() {
        this.institutionsService.getInstitutions().subscribe(response => {
            console.log(response);
            this.institutions = response.map(value => {
                const select2: Select2OptionData = {
                    id: null,
                    text: null
                };
                select2.id = value.id.toString();
                select2.text = value.name;
                return select2;
            });
        });
    }

}
