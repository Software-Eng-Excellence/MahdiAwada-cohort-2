import { OrderController } from "../controllers/order.controller";
import { Router } from "express";
import { OrderManagementService } from "../services/orderManagement.service";
import { asyncHandler } from "../middleware/asyncHandler";
import { hasPermission } from "../middleware/authorize";
import { Permission } from "../config/roles";

const orderController = new OrderController(new OrderManagementService());

const route = Router();

route.route('/')
     .get(asyncHandler(orderController.getOrders.bind(orderController)))
     .post(asyncHandler(orderController.createOrder.bind(orderController)));

route.route('/:id')
     .get(hasPermission(Permission.READ_ORDER),asyncHandler(orderController.getOrder.bind(orderController)))
     .put(hasPermission(Permission.UPDATE_ORDER), asyncHandler(orderController.updateOrder.bind(orderController)))
     .delete(hasPermission(Permission.DELETE_ORDER),asyncHandler(orderController.deleteOrder.bind(orderController)))

export default route;