import {Pipe, PipeTransform} from '@angular/core';
import {Project} from '../services/project/project.interface';

@Pipe({
    name: 'filterProjects'
})
export class FilterProjectsPipe implements PipeTransform {

    transform(projects: Project[], searchValue: string): Project[] {

        if (!searchValue) {
            return projects;
        }

        return  projects.filter(value => value.id.toString().toLowerCase().indexOf(searchValue.toLowerCase()) > -1
            || value.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
            || value.endDate.toString().toLowerCase().indexOf(searchValue.toLowerCase()) > -1
            || value.price.toString().toLowerCase().indexOf(searchValue.toLowerCase()) > -1
            || value.startDate.toString().toLowerCase().indexOf(searchValue.toLowerCase()) > -1
            || value.paid.toString().toLowerCase().indexOf(searchValue.toLowerCase()) > -1
            || value.institutionName.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
        );

    }

}
