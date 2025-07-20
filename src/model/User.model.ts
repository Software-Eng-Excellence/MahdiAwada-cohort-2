import { Role } from "../config/roles";
import { ID } from "../repository/IRepository";

export class User implements ID{
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    constructor(name: string,email: string,password: string,id: string,role: Role = Role.user) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.id = id;
        this.role = role;
    }

    getName(): string {
        return this.name;
    }

    getEmail(): string {
        return this.email;
    }

    getPassword(): string {
        return this.password;
    }

    getId(): string {
        return this.id;
    }
    
    getRole(): string {
        return this.role;
    }
} 