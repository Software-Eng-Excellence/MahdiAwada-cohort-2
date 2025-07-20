import { User } from "../model/User.model";
import { createUserRepository, UserRepository } from "../repository/sqlite/User.repository";
import { id } from "../repository/IRepository";
import { NotFoundException } from "../util/exceptions/http/NotFoundException";

export class UserManagementService {
    private userRepository?: UserRepository;

    async getAllUsers(): Promise<User[]> {
        return (await this.getRepo()).getAll();
    }
    async getUserById(userId: id): Promise<User> {
        return (await this.getRepo()).get(userId);
    }
    async createUser(user: User): Promise<id> {
        return (await this.getRepo()).create(user);
    }
    async updateUser(user: User): Promise<void> {
        (await this.getRepo()).update(user);
    }
    async deleteUser(userId: id): Promise<void> {
        (await this.getRepo()).delete(userId);
    }

    async validateUser(email: string, password: string): Promise<User> {
        const user: User = await (await this.getRepo()).getByEmail(email);
        if(!user) {
            throw new NotFoundException('User not found via email');
        }
        if(user.getPassword() !== password) {
            throw new NotFoundException('Invalid password');
        }
        return user
    }

    private async getRepo() {
        if (!this.userRepository) {
            this.userRepository = await createUserRepository();
        }
        return this.userRepository;
    }
} 