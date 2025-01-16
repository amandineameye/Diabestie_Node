import { Router as historyRouter } from "express";
import historyController from '../controllers/history.controller';

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

export default historyRouter;
