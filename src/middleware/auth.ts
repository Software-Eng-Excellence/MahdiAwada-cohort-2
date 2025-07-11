import { NextFunction , Request , Response } from "express";
import { AuthenticationService } from "../services/authentication.service";
import { AuthenticationFailedException } from "../util/exceptions/AuthenticationException";

// todo add a singleton to the authentication service
const authService = new AuthenticationService();

export function authenticate(req: Request, res: Response, next: NextFunction) {
    // get token from header
    const token = req.headers['authorization']?.split(' ')[1];

    // if no token then throw auth error
    if (!token) {
        throw new AuthenticationFailedException();
    }

    // verify token
    const payload  = authService.verify(token);

    // add the payload to the request
    (req as any).userId = payload.userId;

    // call next
    next();
}