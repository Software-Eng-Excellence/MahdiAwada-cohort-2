import { toRole } from "../config/roles";
import { User } from "../model/User.model";

export interface SQLiteUser {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
}

export class SQLiteUserMapper {
    map(data: SQLiteUser): User {
        return new User(
            data.name,
            data.email,
            data.password,
            data.id,
            toRole(data.role)
        );
    }

    mapToSQLite(user: User): SQLiteUser {
        return {
            id: user.getId(),
            name: user.getName(),
            email: user.getEmail(),
            password: user.getPassword(),
            role: user.getRole()
        };
    }
} 