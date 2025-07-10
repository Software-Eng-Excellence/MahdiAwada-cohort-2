import { Router } from "express";
import { UserManagementService } from "../services/userManagement.service";
import { asyncHandler } from "../middleware/asyncHandler";
import { AuthenticationService } from "../services/authentication.service";
import { AuthenticationController } from "../controllers/auth.controller";

const router = Router();

const authService = new AuthenticationService();
const userService = new UserManagementService();

const authController = new AuthenticationController(authService,userService )

router.route('/login')
    .post(asyncHandler(authController.login.bind(authController)));

// router.route('/logout')
//     .get();

export default router; 