const express = require("express");
const generalController = require("../controllers/general.controller");

const generalRouter = express.Router();

generalRouter.get("/general/getUserNames", generalController.getUserNames);
generalRouter.get("/", (request, response) => {
	return response.status(500).json({ message: "Welcome!" });
});

module.exports = generalRouter;
