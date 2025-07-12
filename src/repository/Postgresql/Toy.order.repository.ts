import { id, Initializable, IRepository } from "../IRepository";
import { IdentifiableToy } from "../../model/Toy.model";
import { Connection } from "pg";
import { ConnectionManager } from "./ConnectionManager";
import logger from "util/logger";
import { DbException, InitializationException, ItemNotFoundException } from "util/exceptions/repositoryExceptions";
import { PostgreCakeMapper } from "mappers/Cake.mapper";
import { PostgreToyMapper } from "mappers/Toy.mapper";

const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS toy (
    id VARCHAR(255) PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    age_group VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    material VARCHAR(255) NOT NULL,
    battery_required BOOLEAN NOT NULL,
    educational BOOLEAN NOT NULL,
);
`;

const INSERT_TOY = `
INSERT INTO toy (id, type, age_group, brand, material, battery_required, educational)
VALUES ($1, $2, $3, $4, $5, $6, $7);
`;

const SELECT_TOY = `SELECT * FROM toy WHERE id = $1;`;

const SELECT_ALL = `SELECT * FROM toy;`;

const UPDATE_TOY = `
UPDATE toy SET 
    type = $2,
    age_group = $3,
    brand = $4,
    material = $5,
    battery_required = $6,
    educational = $7
WHERE id = $1;
`;

const DELETE_TOY = `DELETE FROM toy WHERE id = $1;`;

export class ToyRepository implements IRepository<IdentifiableToy>, Initializable {
    async init(): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(CREATE_TABLE); 
            logger.info("Toy table initialized");
        } catch (error) {
            logger.error("Failed to initialize Toy table", error as Error);
            throw new InitializationException("Failed to initialize Toy table", error as Error)
        }
        
    }
    
    async create(item: IdentifiableToy): Promise<id> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(INSERT_TOY, [
                item.getId(),
                item.getType(),
                item.getAgeGroup(),
                item.getBrand(),
                item.getMaterial(),
                item.isBatteryRequired(),
                item.isEducational()
            ]);
            return item.getId();
        } catch (error) {
            logger.error("Failed to create toy of id %s %o",item.getId(), error as Error);
            throw new DbException("Failed to create toy of id %s %o"+ item.getId(), error as Error);
        }
    }
    async get(id: id): Promise<IdentifiableToy> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(SELECT_TOY, [id]);
            const mapper = new PostgreToyMapper;
            return mapper.map(result.rows[0]);
        } catch (error) {
            logger.error("Failed to get toy of id %s %o",id, error as Error);
            throw new DbException("Failed to get toy of id %s %o"+ id, error as Error);
        }
    }
    async getAll(): Promise<IdentifiableToy[]> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(SELECT_ALL);
            if(result.rows.length === 0) {
                logger.error("No toys found");
                throw new ItemNotFoundException("No toys found");
            }
            const mapper = new PostgreToyMapper;
            return result.rows.map((toy) => mapper.map(toy));
        } catch (error) {
            logger.error("Failed to get all toys %o",error as Error);
            throw new DbException("Failed to get all toys", error as Error);
        }
    }
    async update(item: IdentifiableToy): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(UPDATE_TOY, [
                item.getId(),
                item.getType(),
                item.getAgeGroup(),
                item.getBrand(),
                item.getMaterial(),
                item.isBatteryRequired(),
                item.isEducational()
            ]);
        } catch (error) {
            logger.error("Failed to update toy of id %s %o",item.getId(), error as Error);
            throw new DbException("Failed to update toy of id %s %o"+ item.getId(), error as Error);
        }
        
    }
    async delete(id: id): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(DELETE_TOY, [id]); 
        } catch (error) {
            logger.error("Failed to delete toy of id %s %o",id, error as Error);
            throw new DbException("Failed to delete toy of id %s %o"+ id, error as Error);
        }
    }

}