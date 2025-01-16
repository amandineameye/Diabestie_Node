const express = require("express");
const authController = require("../controllers/auth.controller");

const authRouter = express.Router();


authRouter.get('/test', (req, res) => {
    res.send(200).json({text: 'Hello World'})
})
authRouter.post("/auth/login", authController.login);
authRouter.post("/auth/register", authController.register);

module.exports = authRouter;
