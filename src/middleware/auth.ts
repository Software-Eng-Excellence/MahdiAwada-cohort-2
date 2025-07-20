import { NextFunction , Request , Response } from "express";
import { AuthenticationService } from "../services/authentication.service";
import { AuthenticationFailedException } from "../util/exceptions/http/AuthenticationException";
import { AuthRequest } from "config/types";

// todo add a singleton to the authentication service
const authService = new AuthenticationService();

export function authenticate(req: Request, res: Response, next: NextFunction) {
    // get token from header
    let token = req.cookies.token;
    const refreshToken = req.cookies.refreshToken;

    // if no token then throw auth error
    if (!token) {
        if (!refreshToken) {
            throw new AuthenticationFailedException();
        }
            const newToken = authService.refreshToken(refreshToken);
            authService.setTokenIntoCookie(res, newToken);
            token = newToken;
    }

    // verify token
    const payload  = authService.verify(token);

    // add the payload to the request
    (req as AuthRequest).user = payload;

    // call next
    next();
}