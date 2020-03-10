export interface Person {
    id?: number;
    firstName: string;
    lastName: string;
    phone: number;
    ci: number;
    email: string;
    role?: 'encargado' | 'interesado';
}
