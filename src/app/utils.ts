import {NotifierOptions, NotifierService} from 'angular-notifier';
import {NotifierNotificationOptions} from 'angular-notifier/lib/models/notifier-notification.model';

export const getDateString = (date: Date): string => {
    {
        const month = (date.getMonth() + 1) >= 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
        const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`
        return `${date.getFullYear()}-${month}-${day}`;
    }
};

export const isInteger = (value: number) => {
    return Number.isInteger(value);
};

export const countDecimals = (value: number) => {
    if (Math.floor(value) === value) { return 0; }
    return value.toString().split('.')[1].length || 0;
}
