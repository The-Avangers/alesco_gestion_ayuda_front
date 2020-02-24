import {Person} from '../person/person.interface';

export interface Project {
    id: number;
    name: string;
    startDate: Date | string;
    endDate: Date | string;
    price: number;
    paid: boolean | string;
    institutionName: string;
}

export interface FullProject {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
    price: number;
    paid: boolean;
    institution: string;
    peopleInvolved: Person[];
    progress: object[];
    payments: object[];
}

export interface PostProject {
    name: string;
    startDate: string;
    endDate: string;
    price: number;
    institutionId: number;
    people: {
        id: number,
        role: 'Encargado' | 'Interesado',
    }[];
}
