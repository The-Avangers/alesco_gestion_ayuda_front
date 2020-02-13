export interface User {
    id: number;
    name: string;
    lastname: string;
    email: string;
    role: string;
}
export interface Login {
    email: string;
    password: string;
}
export interface PostUser {
    name: string;
    lastname: string;
    email: string;
    role: string;
    password: string;
}
