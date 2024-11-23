const express = require("express");
const dashboardController = require("../controllers/dashboard.controller");

const dashboardRouter = express.Router();

dashboardRouter.get("/dashboard/getNote", dashboardController.getNote);
dashboardRouter.get(
	"/dashboard/getMealsSummary",
	dashboardController.getMealsSummary
);
dashboardRouter.get(
	"/dashboard/getIncompleteMeals",
	dashboardController.getIncompleteMeals
);

module.exports = dashboardRouter;
