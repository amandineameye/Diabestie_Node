const express = require("express");
const generalController = require("../controllers/general.controller");

const generalRouter = express.Router();

generalRouter.get("/general/getUserNames", generalController.getUserNames);

module.exports = generalRouter;
