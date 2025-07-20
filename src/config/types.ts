import { JwtPayload } from "jsonwebtoken";
import { Role } from "./roles";
import { Request } from "express";

export enum DBMode {
    SQLITE,
}

export interface UserPayload {
    userId: string;
    role: Role
}

export interface TokenPayload extends JwtPayload{
    user: UserPayload;
}

export interface AuthRequest extends Request {
    user: UserPayload;
}