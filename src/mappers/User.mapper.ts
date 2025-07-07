import { IUser, User } from "../model/User.model";

export interface SQLiteUser {
    id: string;
    name: string;
    email: string;
    password: string;
}

export class SQLiteUserMapper {
    map(data: SQLiteUser): IUser {
        return new User(
            data.name,
            data.email,
            data.password,
            data.id
        );
    }

    mapToSQLite(user: IUser): SQLiteUser {
        return {
            id: user.getId(),
            name: user.getName(),
            email: user.getEmail(),
            password: user.getPassword()
        };
    }
} 