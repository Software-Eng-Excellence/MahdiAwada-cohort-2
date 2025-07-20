import { NextFunction, Request, Response } from "express";
import { Permission, Role, rolePermissions } from "../config/roles";
import { AuthenticationFailedException } from "../util/exceptions/http/AuthenticationException";
import { AuthRequest } from "../config/types";
import { InsufficientPermissionException, InvalidRoleException } from "../util/exceptions/http/AuthorizationException";
import logger from "../util/logger";

export function hasPermission(permission: Permission) {
    return (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthRequest;
        if (!authReq.user) {
            throw new AuthenticationFailedException()
        }
        const userRole = authReq.user.role;

        if(!rolePermissions[userRole]) {
            throw new InvalidRoleException(userRole);
        }

        if(!rolePermissions[userRole].includes(permission)) {
            logger.error(`User with role ${userRole} does not have permission ${permission}`);
            throw new InsufficientPermissionException();
        };

        next();
    }

}

export function hasRole(allowedRoles: Role[]) {
     return (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthRequest;
        if (!authReq.user) {
            throw new AuthenticationFailedException()
        }
        const userRole = authReq.user.role;

        if(!allowedRoles.includes(userRole)) {
            logger.error(`User with role ${userRole} does not have access to this resource`);
            throw new InsufficientPermissionException();
        };

        next();
    }
}