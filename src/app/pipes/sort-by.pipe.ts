import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sortBy' })
export class SortByPipe implements PipeTransform {
    // tslint:disable-next-line:no-any
    transform(array: any, field: string): any[] {
        if (!Array.isArray(array)) {
            return;
        }
        // tslint:disable-next-line:no-any
        array.sort((a: any, b: any) => {
            if (a[field] < b[field]) {
                return -1;
            } else if (a[field] > b[field]) {
                return 1;
            } else {
                return 0;
            }
        });
        return array;
    }
}
