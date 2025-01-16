import { Router as addMeal2Router } from "express";
import addMeal2Controller from '../controllers/addMeal2.controller';


addMeal2Router.post(
	"/addMeal2/getSimilarMeals",
	addMeal2Controller.postTotalCarbsAndGetSimilarMeals
);

addMeal2Router.patch("/addMeal2/patchNewMeal", addMeal2Controller.patchNewMeal);

export default addMeal2Router
