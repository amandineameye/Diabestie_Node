import { Router as authRouter } from "express";
import authController from '../controllers/auth.controller';


authRouter.post("/auth/login", authController.login);
authRouter.post("/auth/register", authController.register);

export default authRouter;
