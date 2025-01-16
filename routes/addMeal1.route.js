import { Router as addMeal1Router } from "express";
import addMeal1Controller from '../controllers/addMeal1.controller';


addMeal1Router.post(
	"/addMeal1/getCarbsOptions",
	addMeal1Controller.getCarbsOptions
);

export default addMeal1Router;
