import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterTable'
})
export class FilterTablePipe implements PipeTransform {

    transform<T>(object: T[], searchValue: string): T[] {
        if (!searchValue) {
            return object;
        }

        return  object.filter(value => {
            for (const key in value) {
                if (value.hasOwnProperty(key)) {
                    if (value[key] != null) {
                        if (value[key].toString().toLowerCase().indexOf(searchValue.toLowerCase()) > -1) {
                            return true;
                        }
                    }
                }
            }
        });

    }

}
