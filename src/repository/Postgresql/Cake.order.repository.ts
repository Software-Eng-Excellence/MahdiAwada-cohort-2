import { IdentifiableCake } from "../../model/Cake.model";
import { id, Initializable, IRepository } from "../../repository/IRepository";
import { ConnectionManager } from "./ConnectionManager";
import logger from "../../util/logger";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/repositoryExceptions";
import { PostgreCakeMapper } from "../../mappers/Cake.mapper";

const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS cake (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    flavor TEXT NOT NULL,
    filling TEXT NOT NULL,
    size INTEGER NOT NULL,
    layers INTEGER NOT NULL,
    frosting_type TEXT NOT NULL,
    frosting_flavor TEXT NOT NULL,
    decoration_type TEXT NOT NULL,
    decoration_color TEXT NOT NULL,
    custom_message TEXT NOT NULL,
    shape TEXT NOT NULL,
    allergies TEXT NOT NULL,
    special_ingredients TEXT,
    packaging_type TEXT NOT NULL
);
`;

const INSERT_CAKE = `
INSERT INTO cake (
    id,
    type,
    flavor,
    filling,
    size,
    layers,
    frosting_type,
    frosting_flavor,
    decoration_type,
    decoration_color,
    custom_message,
    shape,
    allergies,
    special_ingredients,
    packaging_type
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
);
`;

const SELECT_BY_ID = `
SELECT * FROM cake WHERE id = $1;
`;

const SELECT_ALL = `SELECT * FROM cake`;

const UPDATE_CAKE = `UPDATE cake SET 
    type = $2,
    flavor = $3,
    filling = $4,
    size = $5,
    layers = $6,
    frosting_type = $7,
    frosting_flavor = $8,
    decoration_type = $9,
    decoration_color = $10,
    custom_message = $11,
    shape = $12,
    allergies = $13,
    special_ingredients = $14,
    packaging_type = $15
WHERE id = $1;`;

const DELETE_CAKE = `DELETE FROM cake WHERE id = $1;`;

export class CakeRepository implements IRepository<IdentifiableCake>, Initializable {
    async init(): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(CREATE_TABLE);
            logger.info("Cake table initialized");
        } catch (error) {
            logger.error("Failed to initialize Cake table", error as Error);
            throw new InitializationException("Failed to initialize Cake table", error as Error)
        }
        
    }
    async create(item: IdentifiableCake): Promise<id> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(INSERT_CAKE, [
                item.getId(),
                item.getType(),
                item.getFlavor(),
                item.getFilling(),
                item.getSize(),
                item.getLayers(),
                item.getFrostingType(),
                item.getFrostingFlavor(),
                item.getDecorationType(),
                item.getDecorationColor(),
                item.getCustomMessage(),
                item.getShape(),
                item.getAllergies(),
                item.getSpecialIngredients(),
                item.getPackagingType()
            ]);
            return item.getId();
        } catch (error) {
             throw new DbException("Failed to create order", error as Error);
        }
    }
    async get(id: id): Promise<IdentifiableCake> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(SELECT_BY_ID, [id]);
            if (result.rows.length === 0) {
                throw new ItemNotFoundException(`Cake with id ${id} not found`);
            }
            const mapper = new PostgreCakeMapper();
            return mapper.map(result.rows[0]);
        } catch (error) {
            logger.error("Failed to get cake of id %s %o",id, error as Error);
            throw new DbException("Failed to get cake of id %s %o"+ id, error as Error);
        }
    }
    async getAll(): Promise<IdentifiableCake[]> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(SELECT_ALL);
            const mapper = new PostgreCakeMapper();
            return result.rows.map((cake) => mapper.map(cake));
        } catch (error) {
            logger.error("Failed to get all cakes ");
            throw new DbException("Failed to get all cakes", error as Error);
        }
        
    }
    async update(item: IdentifiableCake): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(UPDATE_CAKE, [
                item.getId(),
                item.getType(),
                item.getFlavor(),
                item.getFilling(),
                item.getSize(),
                item.getLayers(),
                item.getFrostingType(),
                item.getFrostingFlavor(),
                item.getDecorationType(),
                item.getDecorationColor(),
                item.getCustomMessage(),
                item.getShape(),
                item.getAllergies(),
                item.getSpecialIngredients(),
                item.getPackagingType()
        ]);
        } catch (error) {
            logger.error("Failed to update cake of id %s %o",item.getId(), error as Error);
            throw new DbException("Failed to update cake of id %s %o"+ item.getId(), error as Error);
        }
        
    }
    async delete(id: id): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(DELETE_CAKE, [id]); 
        } catch (error) {
            logger.error("Failed to delete cake of id %s %o",id, error as Error);
            throw new DbException("Failed to delete cake of id %s %o"+ id, error as Error);
        }
        
    }
    
}