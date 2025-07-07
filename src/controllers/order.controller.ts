import { Request, Response } from "express";
import { OrderManagementService } from "../services/orderManagement.service";
import { IdentifiableOrderItem } from "../model/Order.model";
import { JsonRequestFactory } from "../mappers";
import { BadRequestException } from "../util/exceptions/BadRequestException";


export class OrderController {
    constructor(private readonly orderService: OrderManagementService) { }
    // create an order
    public async createOrder(request: Request, response: Response, ) {
            const order: IdentifiableOrderItem = JsonRequestFactory.create(request.body.category).map(request.body);
            if (!order) {
                throw new BadRequestException("Order is required to create order", {
                    orderNotdefined: true
                });
            }
            const newOrder = await this.orderService.createOrder(order);
            response.status(201).json(newOrder);
    }

    // get Order
    public async getOrder(request: Request, response: Response) {
            const id = request.params.id;
            if(!id){
                throw new BadRequestException("Id is required to get order", 
                    {
                        idNotDefined: true
                    });
            }
            const order = await this.orderService.getOrder(id);
    }
    // get all Orders
    public async getOrders(request: Request, response: Response) {
            const orders = await this.orderService.getAllOrders();
            response.status(200).json(orders);
    }

    // update Order
    public async updateOrder(request: Request, response: Response) {
            const id = request.params.id;
            if(!id) {
                throw new BadRequestException("Id is required to update order", 
                    {
                        idNotDefined: true
                    });
            }
            const order: IdentifiableOrderItem = JsonRequestFactory.create(request.body.category).map(request.body);
            if(!order) {
                throw new BadRequestException("Order is required to update order", 
                    {
                        orderNotDefined: true
                    });
            }
            if(order.getId() !== id) {
                throw new BadRequestException("Id in body is different from id in param", 
                    {
                        idNotSame: true,
                        idInBody: order.getId(),
                        idInParam: id
                    });
            }
            const updateOrder = await this.orderService.updateOrder(order);
            response.status(200).json(updateOrder);
    }

    // delete Order
    public async deleteOrder(request: Request, response: Response) {
            const id = request.params.id;
            if (!id) {
                throw new BadRequestException("Id is required to delete order", 
                    {
                        idNotDefined: true
                    });
            }
            await this.orderService.deleteOrder(id);
            response.status(204).send();
    }

    // get total revenue

    // get total orders
}