import {Pipe, PipeTransform} from '@angular/core';
import {Project} from '../services/project/project.interface';

@Pipe({
    name: 'filterTable'
})
export class FilterTablePipe implements PipeTransform {

    // tslint:disable-next-line:no-any
    transform(object: any[], searchValue: string): Project[] {

        if (!searchValue) {
            return object;
        }

        const keys = object.map(value => {});

        return  object.filter(value => {
            for (const key in value) {
                if (value.hasOwnProperty(key)) {
                    if (value[key].toString().toLowerCase().indexOf(searchValue.toLowerCase()) > -1) {
                        return true;
                    }

                }
            }
        });

    }

}
