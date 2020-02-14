import {NotifierOptions, NotifierService} from 'angular-notifier';
import {NotifierNotificationOptions} from 'angular-notifier/lib/models/notifier-notification.model';

export const getDateString = (date: Date): string => {
    {
        const month = (date.getMonth() + 1) >= 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
        return `${date.getFullYear()}-${month}-${date.getDate()}`;
    }
};
