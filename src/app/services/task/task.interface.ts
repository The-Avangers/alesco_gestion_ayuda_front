import {Person} from '../person/person.interface';
import {Project} from '../project/project.interface';

export interface PostTask {
    projectId: number;
    name: string;
    completionDate: Date;
    completed: boolean;
    people: number[];
}

export interface Task {
    id: number;
    name: number;
    project: Project;
    description: string;
    completed: boolean;
    completionDate: Date | string;
    people: Person[];
}
