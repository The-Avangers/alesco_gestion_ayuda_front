export interface User {
    ci: number;
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
    ci?: string;
    password?: string;
}

export interface ChangeUserPassword {
    oldPassword: string;
    newPassword: string;
}
