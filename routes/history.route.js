const express = require("express");
const historyController = require("../controllers/history.controller");

const historyRouter = express.Router();

historyRouter.get(
	"/history/getMostRecentMeals",
	historyController.getMostRecentMeals
);

historyRouter.get(
	"/history/getMostRecentMealsCount",
	historyController.getMostRecentMealsCount
);

historyRouter.get(
	"/history/getFilteredMeals",
	historyController.getFilteredMeals
);

module.exports = historyRouter;
