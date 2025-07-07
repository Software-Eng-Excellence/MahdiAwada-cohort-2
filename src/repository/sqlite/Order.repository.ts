import { IIdentifiableOrderItem, IOrder } from "../../model/IOrder";
import { id, Initializable, IRepository } from "../IRepository";
import { DbException, InitializationException } from "../../util/exceptions/repositoryExceptions";
import { IIdentifiableItem } from "../../model/IItem";
import { ConnectionManager } from "./ConnectionManager";
import { SQLLiteOrder, SQLLiteOrderMapper } from "../../mappers/Order.mapper";
import logger from "../../util/logger";


const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS "order" (
            id TEXT PRIMARY KEY,
            quantity INTEGER NOT NULL,
            price INTEGER NOT NULL,
            item_category TEXT NOT NULL,
            item_id TEXT NOT NULL

        )`;

const INSERT_ORDER = `INSERT INTO "order" (id, quantity, price, item_category, item_id) VALUES (?, ?, ?, ?, ?)`;

const SELECT_BY_ID = `SELECT * FROM "order" WHERE id = ?`;

const SELECT_ALL = `SELECT * FROM "order" WHERE item_category = ? `;

const DELETE_ODRER = `DELETE FROM "order" WHERE id = ?`;

const UPDATE_ORDER = `UPDATE "order" SET quantity = ? , price = ? , item_category = ?, item_id = ? WHERE id = ?`;

export class OrderRepository implements IRepository<IIdentifiableOrderItem>, Initializable {
    constructor(private readonly itemRepository: IRepository<IIdentifiableItem> & Initializable) {
        
    }

    async init() {
        try {
        const conn = await ConnectionManager.getConnection();
        await conn.exec(CREATE_TABLE);
        await this.itemRepository.init();
        logger.info("Order table initialized")
        } catch (error: unknown) {
            logger.error("Failed to initialize Cake table", error as Error);
            throw new InitializationException("Failed to initialize Order table", error as Error)
        }
    }

    async create(order: IIdentifiableOrderItem): Promise<id> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            await conn.exec("BEGIN TRANSACTION");
            const item_id = await this.itemRepository.create(order.getItem());
            await conn.run(INSERT_ORDER, [order.getId(),
                order.getQuantity(),
                order.getPrice(),
                order.getItem().getCategory(),
                item_id
                ]);
            await conn.exec("COMMIT");
            return order.getId();
        } catch (error: unknown) {
            logger.error("Failed to create order", error as Error);
            conn && conn.exec("ROLLBACK");
            throw new DbException("Failed to create order", error as Error);
        }
    }
    async get(id: id): Promise<IIdentifiableOrderItem> {
        try {
            const conn = await ConnectionManager.getConnection();
            const result = await conn.get<SQLLiteOrder>(SELECT_BY_ID, id);
            if (!result) {
                logger.error("Order of id %s not found", id);
                throw new Error("Order of id "+id+" not found");
            }
            const item = await this.itemRepository.get(result.item_id);
            return new SQLLiteOrderMapper().map({data: result, item: item}); // TODO must remove and map
        } catch (error) {
            logger.error("Failed to get order of id %s %o",id, error as Error);
            throw new DbException("Failed to get order of id %s %o"+ id, error as Error);
        }
    }
    async getAll(): Promise<IIdentifiableOrderItem[]> {
        try {
            const conn = await ConnectionManager.getConnection();
            const items = await this.itemRepository.getAll();
            if (items.length === 0 ) {
                return [];
            }
            const orders = await conn.all<SQLLiteOrder[]>(SELECT_ALL, "cake");
            // bind orders to items
            const bindedOrders = orders.map((order) => {
                const item = items.find((item) => item.getId() === order.item_id);
                if (!item) {
                    throw new Error("Item of id "+ order.item_id +" not found");
                }
                return {order, item};
            });
            // for each binded order and item map it into an identifiable order
            const mapper = new SQLLiteOrderMapper();
            const identifiableOrders = bindedOrders.map(({order, item}) => {
                return mapper.map({data: order, item});
            })
            // return lits of identifiale orders
            return identifiableOrders;
        } catch (error) {
             logger.error("Failed to get all orders");
            throw new DbException("Failed to get all orders" , error as Error);
        }
    }
    async update(order: IIdentifiableOrderItem): Promise<void> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            conn.exec("BEGIN TRANSACTION");
            await this.itemRepository.update(order.getItem());
            await conn.run(UPDATE_ORDER, [
                order.getQuantity(),
                order.getPrice(),
                order.getItem().getCategory(),
                order.getItem().getId(),
                order.getId()
            ]);
                conn.exec("COMMIT");
        } catch (error: unknown) {
            logger.error("Failed to update order of id %s %o",order.getId(), error as Error);
            conn && conn.exec("ROLLBACK");
            throw new DbException("Failed to update order of id %s %o"+ order.getId(), error as Error);
        }
    }
    async delete(id: id): Promise<void> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            conn.exec("BEGIN TRANSACTION");
            const itemId = (await this.get(id)).getItem().getId();
            await this.itemRepository.delete(itemId);
            await conn.run(DELETE_ODRER, id);
                conn.exec("COMMIT");
        } catch (error: unknown) {
            logger.error("Failed to delete order", error as Error);
            conn && conn.exec("ROLLBACK");
            throw new DbException("Failed to delete order", error as Error);
        }
    }
    
}