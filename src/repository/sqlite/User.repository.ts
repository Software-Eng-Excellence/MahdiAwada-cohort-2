import { User } from "../../model/User.model";
import { id, InitializableRepository, IRepository } from "../IRepository";
import { DbException, InitializationException } from "../../util/exceptions/repositoryExceptions";
import { ConnectionManager } from "./ConnectionManager";
import { SQLiteUser, SQLiteUserMapper } from "../../mappers/User.mapper";
import logger from "../../util/logger";
import { Database } from "sqlite";

const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS "user" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL);
    `;

const INSERT_USER = `INSERT INTO "user" (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)`;

const SELECT_BY_ID = `SELECT * FROM "user" WHERE id = ?`;

const SELECT_ALL = `SELECT * FROM "user"`;

const SELECT_BY_EMAIL = `SELECT * FROM "user" WHERE email = ?`;

const DELETE_USER = `DELETE FROM "user" WHERE id = ?`;

const UPDATE_USER = `UPDATE "user" SET name = ?, email = ?, password = ?, role = ? WHERE id = ?`;

export class UserRepository implements IRepository<User>, InitializableRepository<User> {
    private db: Database | null = null;
    async init(): Promise<void> {
        try {
            this.db = await ConnectionManager.getConnection();
            await this.db.exec(CREATE_TABLE);
            await this.db.exec(`
                ALTER TABLE USERS ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
                `);
            logger.info("User table initialized");
        } catch (error) {
            logger.error("Failed to initialize User table", error as Error);
            throw new InitializationException("Failed to initialize User table", error as Error);
        }
    }

    async create(user: User): Promise<id> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.run(INSERT_USER, [
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPassword(),
                user.getRole()
            ]);
            return user.getId();
        } catch (error: unknown) {
            logger.error("Failed to create user", error as Error);
            throw new DbException("Failed to create user", error as Error);
        }
    }

    async get(id: id): Promise<User> {
        try {
            const conn = await ConnectionManager.getConnection();
            const user = await conn.get(SELECT_BY_ID, id);
            if (!user) {
                logger.error("User of id %s not found", id);
                throw new Error("User of id " + id + " not found");
            }
            const mapper = new SQLiteUserMapper();
            return mapper.map(user);
        } catch (error) {
            logger.error("Failed to get user of id %s %o", id, error as Error);
            throw new DbException("Failed to get user of id " + id, error as Error);
        }
    }

    async getAll(): Promise<User[]> {
        try {
            const conn = await ConnectionManager.getConnection();
            const users = await conn.all<SQLiteUser[]>(SELECT_ALL);
            const mapper = new SQLiteUserMapper();
            return users.map(user => mapper.map(user));
        } catch (error) {
            logger.error("Failed to get all users", error as Error);
            throw new DbException("Failed to get all users", error as Error);
        }
    }

    async update(user: User): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.run(UPDATE_USER, [
                user.getName(),
                user.getEmail(),
                user.getPassword(),
                user.getRole(),
                user.getId(),
            ]);
        } catch (error: unknown) {
            logger.error("Failed to update user of id %s %o", user.getId(), error as Error);
            throw new DbException("Failed to update user of id " + user.getId(), error as Error);
        }
    }

    async delete(id: id): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.run(DELETE_USER, id);
        } catch (error: unknown) {
            logger.error("Failed to delete user", error as Error);
            throw new DbException("Failed to delete user", error as Error);
        }
    }

    async getByEmail(email: string): Promise<User> {
        try {
            const conn = await ConnectionManager.getConnection();
            const result = await conn.get<SQLiteUser>(SELECT_BY_EMAIL, email);
            if (!result) {
                logger.error("User with email %s not found", email);
                throw new Error("User with email " + email + " not found");
            }
            return new SQLiteUserMapper().map(result);
        } catch (error) {
            logger.error("Failed to get user by email %s %o", email, error as Error);
            throw new DbException("Failed to get user by email " + email, error as Error);
        }
    }

} 

export async function createUserRepository(): Promise<UserRepository> {
    const userRepository = new UserRepository();
    await userRepository.init();
    return userRepository;
}