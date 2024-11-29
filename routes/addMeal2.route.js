const express = require("express");
const addMeal2Controller = require("../controllers/addMeal2.controller");

const addMeal2Router = express.Router();

addMeal2Router.post(
	"/addMeal2/getSimilarMeals",
	addMeal2Controller.postTotalCarbsAndGetSimilarMeals
);

addMeal2Router.patch("/addMeal2/patchNewMeal", addMeal2Controller.patchNewMeal);

module.exports = addMeal2Router;
