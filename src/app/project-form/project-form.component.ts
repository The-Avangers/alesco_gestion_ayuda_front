import {Component, OnInit} from '@angular/core';
import {InstitutionService} from '../services/institution/institution.service';
import {ProjectsService} from '../services/project/projects.service';
import {Select2OptionData} from 'ng2-select2';

@Component({
    selector: 'app-project-form',
    templateUrl: './project-form.component.html',
    styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {

    selectOptions: Select2Options;
    institutions: Select2OptionData[];
    private now = new Date();

    constructor(private projectsService: ProjectsService, private institutionsService: InstitutionService) {
    }

    ngOnInit() {
        this.selectOptions = {
            matcher: (term: string, text: string) => {
                return text.toUpperCase().indexOf(term.toUpperCase()) === 0;
            }
        };
        this.institutionsService.getInstitutions().subscribe(response => {
            console.log(response);
            this.institutions = response.map(value => {
                const select2: Select2OptionData = {
                    id: null,
                    text: null
                };
                select2.id = value.id.toString();
                select2.text = `(${value.id}) ${value.name}`;
                return select2;
            });
        });
    }

    getMinEndDate() {
        const month = (this.now.getMonth() + 1) >= 10 ? this.now.getMonth() + 1 : `0${this.now.getMonth() + 1}`;
        console.log(`${this.now.getFullYear()}-${month}-${this.now.getDate()}`);
        return `${this.now.getFullYear()}-${month}-${this.now.getDate()}`;
    }

}
