const express = require("express");
const dashboardController = require("../controllers/dashboard.controller");
const dashBoardController = require("../controllers/dashboard.controller");

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

dashboardRouter.patch("/dashboard/updateNote", dashBoardController.patchNote);
dashboardRouter.patch(
	"/dashboard/updateIncompleteMeal",
	dashboardController.patchIncompleteMeals
);

module.exports = dashboardRouter;
