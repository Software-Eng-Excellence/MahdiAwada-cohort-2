import { RepositoryFactory } from "../repository/Repository.factory";
import { IIdentifiableOrderItem } from "../model/IOrder";
import { ItemCategory } from "../model/IItem";
import { IRepository } from "../repository/IRepository";
import  config  from "../config";
import { NotFoundException } from "../util/exceptions/NotFoundException";
import { BadRequestException } from "../util/exceptions/BadRequestException";

export class OrderManagementService {

    // Create an order
    public async createOrder(order: IIdentifiableOrderItem): Promise<IIdentifiableOrderItem> {
        // validation order
        this.validateOrder(order);

        // persist the new order
        const repo = await this.getRepo(order.getItem().getCategory());
        await repo.create(order);
        return order;
    }

    // Get Order
    public async getOrder(id:string): Promise<IIdentifiableOrderItem> {
        const categories = Object.values(ItemCategory);
        for(const category of categories) {
            try {
            const repo = await this.getRepo(category);
            const order = await repo.get(id);
            return order;
            } catch (error) {
                
            }
            
        }
        throw new NotFoundException(`Order with id ${id} not found`);
    }

    // Update Order
    public async updateOrder(order: IIdentifiableOrderItem): Promise<void> {
        // validation Order
        this.validateOrder(order);

        // persist the new order
        const repo = await this.getRepo(order.getItem().getCategory());
        await repo.update(order);
    }
    
    // Delete Order
    public async deleteOrder(id: string): Promise<void> {
        const categories = Object.values(ItemCategory);
        for (const category of categories) {
            const repo = await this.getRepo(category);
            const order = await repo.get(id);
            if(order) {
                await repo.delete(id);
                return;
            }
        }
        throw new NotFoundException(`Order with id ${id} not found`);
    }
    // Get All Orders
    public async getAllOrders(): Promise<IIdentifiableOrderItem[]> {
        // const categories = Object.values(ItemCategory);
        const categories = Object.values(ItemCategory).filter(
        (value) => typeof value === 'number'
    ) as ItemCategory[];
        const allOrders: IIdentifiableOrderItem[] = [];
        for (const category of categories) {
            const repo = await this.getRepo(category);
            const orders = await repo.getAll();
            allOrders.push(...orders);
        }
        return allOrders;
    }
    // get total revenue
    public async getTotalRevenue(): Promise<number> {
        const orders = await this.getAllOrders();
        const revenues = orders.map(order => order.getPrice() * order.getQuantity());
        let total = 0;
        for (const revenue of revenues) {
            total += revenue;
        }
        return total;
    }

    // get total orders
    public async getTotalOrders(): Promise<number> {
        const orders = await this.getAllOrders();
        return orders.length;
    }

    private getRepo(category: ItemCategory): Promise<IRepository<IIdentifiableOrderItem>>{
        return RepositoryFactory.create(config.dbMode, category);
    }

    private validateOrder(order: IIdentifiableOrderItem): void {
        if (!order.getItem() || order.getPrice() <= 0 || order.getQuantity() <= 0) {
            const details = {
                ItemNotDefined: !order.getItem(),
                PriceNegative: order.getPrice() <= 0,
                QuantityNegative: order.getQuantity() <= 0
            }
            throw new BadRequestException("Invalid order: item, price, and quantity must be valid.", details);
        }
    }

}