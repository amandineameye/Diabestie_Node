const express = require("express");
const authController = require("../controllers/auth.controller");

const authRouter = express.Router(); 

authRouter.post("/auth/login", authController.login);


module.exports = authRouter;