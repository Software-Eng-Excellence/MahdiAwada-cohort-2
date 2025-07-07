import { IIdentifiableOrderItem } from "../model/IOrder";
import { Initializable, IRepository } from "./IRepository";
import { ItemCategory } from "../model/IItem";
import { OrderRepository } from "./sqlite/Order.repository";
import { CakeRepository } from "./sqlite/Cake.order.repository";
import { DBMode } from "../config/types";


export class RepositoryFactory {
    public static async create(mode: DBMode , category: ItemCategory): Promise<IRepository<IIdentifiableOrderItem>> {
        switch (mode) {
            case DBMode.SQLITE: {
                let repository: IRepository<IIdentifiableOrderItem> & Initializable;
                switch (category) {
                    case ItemCategory.CAKE:
                        repository = new OrderRepository(new CakeRepository());
                        break;
                    default:
                        throw new Error('Unsupported category');
                }
                await repository.init();
                return repository;
            }

            // Deprecated
            // case DBMode.FILE:
            //     throw new Error("File mode is deprecated");
            // default:
            //     throw new Error("Unsupported DB mode");


        }
    }
}