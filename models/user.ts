export interface User {
    id: number;
    name: string;
    phone: string;
    is_active: boolean;
}
export interface UserRegister {
    name: string;
    phone: string;
    password: string;
}
