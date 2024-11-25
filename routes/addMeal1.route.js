const express = require("express");
const addMeal1Controller = require("../controllers/addMeal1.controller");

const addMeal1Router = express.Router();

addMeal1Router.post(
	"/addMeal1/getCarbsOptions",
	addMeal1Controller.getCarbsOptions
);

module.exports = addMeal1Router;
