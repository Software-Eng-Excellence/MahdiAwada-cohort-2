import { Router } from "express";
import OrderRoutes from "./order.route";
import UserRoutes from "./user.route";
import AuthRoutes from "./auth.route";
import { authenticate } from "../middleware/auth";
const routes = Router();

routes.use('/orders', authenticate , OrderRoutes);
routes.use('/users', UserRoutes);
routes.use('/auth', AuthRoutes);

export default routes;