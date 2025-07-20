import { Request, Response } from "express";
import { UserManagementService } from "../services/userManagement.service";
import { BadRequestException } from "../util/exceptions/http/BadRequestException";
import { NotFoundException } from "../util/exceptions/http/NotFoundException";
import { ServiceException } from "../util/exceptions/ServiceException";
import { User } from "../model/User.model";
import { generateUUID } from "../util";
import logger from "../util/logger";
import { toRole } from "../config/roles";

export class UserController {
    private userService: UserManagementService;
    constructor(userService: UserManagementService) {
        this.userService = userService;
    }

    // Create a user
    public async createUser(request: Request, response: Response): Promise<void> {
        try {
            const { name, email, password } = request.body;
            
        if (!name || !email || !password) {
            throw new BadRequestException("Name, email, and password are required", {
                name: !name,
                email: !email,
                password: !password
            });
        }

        const newUser = new User(name, email, password, generateUUID('user'), toRole('user'));
        const userId = await this.userService.createUser(newUser);
        
        try {
            const createdUser = await this.userService.getUserById(userId);
            response.status(201).json(createdUser);
        } catch (error) {
            response.status(201).json({ message: "User created, but unable to fetch user details", id: userId });
        }
        } catch (error) {
            logger.error('Error creating user', error);
            throw new ServiceException('Error creating user');
        }
        
        
    }

    // Get user by ID
    public async getUserById(request: Request, response: Response) {
        
            const id = request.params.id;
            if (!id) {
                throw new BadRequestException('User ID is required in the path')
            }
            try {
                const user = await this.userService.getUserById(id);
                response.status(200).json(user);
            } catch (error) {
                logger.error('Error fetching user', error);
                throw new NotFoundException('User not found');
            }
        
        
        
        
    }

    // Get all users
    public async getAllUsers(request: Request, response: Response): Promise<void> {
        try {
            const users = await this.userService.getAllUsers();
            response.status(200).json(users);
        } catch (error) {
            throw new ServiceException('Error fetching users');
        }
    }

    // Update user
    public async updateUser(request: Request, response: Response): Promise<void> {
       try {
            const id = request.params.id;
            const { name, email, password } = request.body;

            if (!id) {
                throw new BadRequestException('User ID is required in the path');
            }

            if(!name && !email && !password) {
                throw new BadRequestException('At least one field is required to', 
                    {
                        name: !name,
                        email: !email,
                        password: !password
                    });
            }
            
                const existingUser = await this.userService.getUserById(id);

                const updateUser = new User(
                    name || existingUser.getName(),
                    email || existingUser.getEmail(),
                    password || existingUser.getPassword(),
                    existingUser.getId(),
                    toRole(existingUser.getRole())
                );

                await this.userService.updateUser(updateUser);

                const result = await this.userService.getUserById(id);
                response.status(200).json(result);
       } catch (error) {
        logger.error('Error updating user', error);
        if ( error instanceof BadRequestException ) {
            throw error;
        }
        if((error as Error).message === 'User not found') {
                    throw new NotFoundException('User not found');
                }
        throw new ServiceException('Error updating user');
    }
        
    }

    // Delete user
    public async deleteUser(request: Request, response: Response) {
        try {
            const id = request.params.id;
            if(!id) {
                throw new BadRequestException('User Id is required in the path');
            }
                await this.userService.deleteUser(id);
                response.status(204).send();
        } catch (error) {
            logger.error('Error deleting user');
            if (error instanceof BadRequestException) {
                throw error;
            }
            if((error as Error).message === 'User not found') {
                    throw new NotFoundException('User not found');
                }
            throw new ServiceException('Error deleting user');
        }
       
    }

} 