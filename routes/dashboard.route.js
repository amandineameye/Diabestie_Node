import { Router as dashboardRouter } from "express";
import dashboardController from '../controllers/dashboard.controller';

dashboardRouter.get("/dashboard/getNote", dashboardController.getNote);
dashboardRouter.get(
	"/dashboard/getMealsSummary",
	dashboardController.getMealsSummary
);
dashboardRouter.get(
	"/dashboard/getIncompleteMeals",
	dashboardController.getIncompleteMeals
);

dashboardRouter.patch("/dashboard/updateNote", dashboardController.patchNote);
dashboardRouter.patch(
	"/dashboard/updateIncompleteMeal",
	dashboardController.patchIncompleteMeals
);

export default dashboardRouter;