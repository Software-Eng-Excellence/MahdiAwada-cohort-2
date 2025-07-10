import { JwtPayload } from "jsonwebtoken";

export enum DBMode {
    SQLITE,
}

export interface TokenPayload extends JwtPayload{
    userId: string;
}

export interface AuthRequest extends Request {
    userId: string;
}