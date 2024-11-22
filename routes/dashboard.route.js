const express = require("express");
const dashboardController = require("../controllers/dashboard.controller");

const dashboardRouter = express.Router();

dashboardRouter.get("/dashboard/getNote", dashboardController.getNote);

module.exports = dashboardRouter;
