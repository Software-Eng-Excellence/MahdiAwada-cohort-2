import { IIdentifiableOrderItem, IOrder } from "../model/IOrder";
import { IdentifiableOrderItemBuilder, OrderBuilder } from "../model/builders/order.builder";
import { IMapper } from "./IMapper";
import { IIdentifiableItem, IItem } from "../model/IItem";
import { IdentifiableOrderItem } from "model/Order.model";


export class CSVOrderMapper implements IMapper<string[], IOrder> {
    constructor(private itemMapper: IMapper<string[], IItem>){
        
    }

    map(data: string[]): IOrder {
        const item: IItem = this.itemMapper.map(data);
        return OrderBuilder.newBuilder()
                            .setId(data[0])
                            .setQuantity(parseInt(data[data.length -1]))
                            .setPrice(parseInt(data[data.length -2]))
                            .setItem(item)
                            .build()
        
    }

    reverseMap(data: IOrder): string[] {
        const item = this.itemMapper.reverseMap(data.getItem());
        return [
            data.getId(),
            ...item,
            data.getPrice().toString(),
            data.getQuantity().toString()
        ]
    }
   
}

export interface SQLLiteOrder {
    id: string;
    quantity: number;
    price: number;
    item_category: string;
    item_id: string;
}


export class SQLLiteOrderMapper implements IMapper<{data: SQLLiteOrder, item: IIdentifiableItem}, IIdentifiableOrderItem> {
    map({data , item}:{data: SQLLiteOrder, item: IIdentifiableItem}): IIdentifiableOrderItem {
        const order = OrderBuilder.newBuilder().setId(data.id)
                                               .setPrice(data.price)
                                               .setQuantity(data.quantity)
                                               .setItem(item)
                                               .build();
        return IdentifiableOrderItemBuilder.newBuilder().setOrder(order).setItem(item).build();
        
    }

    reverseMap(data: IIdentifiableOrderItem): {data: SQLLiteOrder, item: IIdentifiableItem} {
        return {
            data: {
                id: data.getId(),
                quantity: data.getQuantity(),
                price: data.getPrice(),
                item_category: data.getItem().getCategory(),
                item_id: data.getId()
            },
            item: data.getItem()
        };
    }
   
}


export class JsonRequestOrderMapper implements IMapper<any, IdentifiableOrderItem> {
    constructor(private itemMapper: IMapper<any, IIdentifiableItem>) {}
    map(data: any): IdentifiableOrderItem {
        // extract item and build identifiable item
        const item = this.itemMapper.map(data.item);

        // extract order and build identifiable order
        const order = OrderBuilder.newBuilder()
        .setId(data.id)
        .setPrice(data.price)
        .setQuantity(data.quantity)
        .setItem(item)
        .build();

        return IdentifiableOrderItemBuilder.newBuilder().setOrder(order).setItem(item).build();
    }
    reverseMap(data: IdentifiableOrderItem) {
        return {
            category: data.getItem().getCategory(),
            ...data
        }
    }

}