import {NotifierOptions, NotifierService} from 'angular-notifier';
import {NotifierNotificationOptions} from 'angular-notifier/lib/models/notifier-notification.model';

export const getDateString = (date: Date): string => {
    {
        const month = (date.getMonth() + 1) >= 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
        return `${date.getFullYear()}-${month}-${date.getDate()}`;
    }
};

export const showUnauthorizedAlert = (rolesAllowed: string[] | string, currentRole: string): null | NotifierNotificationOptions => {

    if (!rolesAllowed.includes(currentRole)) {
        return {
            type: 'error',
            message: 'Oops, parece que te has desviado. No tienes permiso para ver el contenido de está página'
        };
        throw new Error('Unauthorized');
    }
    return null;
};
