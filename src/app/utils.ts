import {NotifierOptions, NotifierService} from 'angular-notifier';
import {NotifierNotificationOptions} from 'angular-notifier/lib/models/notifier-notification.model';



export const getDateString = (date: Date): string => {
    {
        const month = (date.getMonth() + 1) >= 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
        const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;
        return `${date.getFullYear()}-${month}-${day}`;
    }
};

export const isInteger = (value: number) => {
    return Number.isInteger(value);
};

export const countDecimals = (value: number) => {
    if (Math.floor(value) === value) {
        return 0;
    }
    return value.toString().split('.')[1].length || 0;
};

export const formatPrice = (price: number): string => {
    return 'Bs ' + (!isInteger(price)
        ? (countDecimals(price) === 2
            ? price.toString().replace('.', ',')
            : price.toString().replace('.', ',') + '0')
        : price + ',00');
};

export const getDateStringFormatted = (date: Date): string => {
    const months = {
        0: 'Enero',
        1: 'Febrero',
        2: 'Marzo',
        3: 'Abril',
        4: 'Mayo',
        5: 'Junio',
        6: 'Julio',
        7: 'Agosto',
        8: 'Septiembre',
        9: 'Octubre',
        10: 'Noviembre',
        11: 'Diciembre',
    };
    // @ts-ignore
    return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
}

export const paginateObject = <T>(objects: T[], pageSize: number) => {
    let aux: T[] = [];
    const paginatedObjects: T[][] = [];
    for (const [index, object] of objects.entries()) {
        if (aux.length === pageSize) {
            paginatedObjects.push(aux);
            aux = [];
        }
        if (index === objects.length - 1) {
            aux.push(object);
            paginatedObjects.push(aux);
            aux = [];
        }
        aux.push(object);
    }
    return paginatedObjects;
};

export const filterTable = <T>(object: T[], searchValue: string): T[] => {
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

};


