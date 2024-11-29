const express = require("express");
const addMeal2Controller = require("../controllers/addMeal2.controller");

const addMeal2Router = express.Router();

addMeal2Router.post(
	"/addMeal2/getSimilarMeals",
	addMeal2Controller.postTotalCarbsAndGetSimilarMeals
);

module.exports = addMeal2Router;
