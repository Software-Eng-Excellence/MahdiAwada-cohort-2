import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserManagementService } from "../services/userManagement.service";
import { asyncHandler } from "../middleware/asyncHandler";
import { authenticate } from "../middleware/auth";

const router = Router();
const userService = new UserManagementService();
const userController = new UserController(userService);

router.route('/')
.get(authenticate ,asyncHandler(userController.getAllUsers.bind(userController)))
.post(asyncHandler(userController.createUser.bind(userController)));

router.route('/:id')
.get(authenticate,asyncHandler(userController.getUserById.bind(userController)))
.put(authenticate,asyncHandler(userController.updateUser.bind(userController)))
.delete(authenticate,asyncHandler(userController.deleteUser.bind(userController)));

export default router; 