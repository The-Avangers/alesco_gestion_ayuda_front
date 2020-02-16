import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterTable'
})
export class FilterTablePipe implements PipeTransform {

    // tslint:disable-next-line:no-any
    transform(object: any[], searchValue: string): any[] {
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
