import { AuthenticationService } from "../services/authentication.service";
import { Request, Response } from "express";
import { BadRequestException } from "../util/exceptions/BadRequestException";
import { UserManagementService } from "../services/userManagement.service";

export class AuthenticationController {
    constructor(
            private authService: AuthenticationService,
            private userService: UserManagementService
        ) {}

    async login(req: Request, res: Response) {
        const {email, password} = req.body || {};
        if (!email || !password) {
            throw new BadRequestException('Email and password are required', {
                email: !email,
                password: !password
            });
        }

        // validate user
        try {
        const userId = await this.userService.validateUser(email, password);
        res.status(200).json({
            message: 'Login successful',
            token: this.authService.generateToken(userId)
        })
        } catch (error) {
            if ((error as Error).message === 'User not found') {
                throw new BadRequestException('Invalid email or password');
            }
            throw error;
        }

        
    }
    logout() {}
}