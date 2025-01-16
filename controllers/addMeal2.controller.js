const mongoClient = require("../tools/db.tool");
import { nanoid } from "nanoid";

const connectToDatabase = async () => {
	try {
		await mongoClient.connect();
		const database = mongoClient.db("diabestieDB");
		return database.collection("usersData");
	} catch (error) {
		console.error("Database connection error:", error);
		throw new Error("Database connection failed");
	}
};

const checkAuthToken = (request, response) => {
	if (!request.token) {
		console.log("CheckAuthToken in AddMeal2 controller says: No request.token");
		return false;
	} else {
		return true;
	}
};

const addMeal2Controller = {
	postTotalCarbsAndGetSimilarMeals: async (request, response) => {
		if (!checkAuthToken(request, response)) return;
		const { username } = request.token;
		const { newMealTotalCarbs } = request.body;

		try {
			const usersData = await connectToDatabase();
			const pipeline = [
				{ $match: { username: username } },
				{ $unwind: "$meals" },
				{
					$match: {
						"meals.bloodSugarAfter": { $ne: undefined },
						"meals.wasActiveAfter": { $ne: undefined },
					},
				},
				{
					$addFields: {
						diff: {
							$abs: {
								$subtract: [newMealTotalCarbs, "$meals.carbsGrams"],
							},
						},
					},
				},
				{ $sort: { diff: 1 } },
				{ $limit: 3 },
				{
					$project: {
						_id: 0,
						"meals.bolus": 1,
						"meals.carbsGrams": 1,
						"meals.change": {
							$subtract: [
								{ $toDouble: "$meals.bloodSugarAfter" }, // Convert to number
								{ $toDouble: "$meals.bloodSugarBefore" }, // Convert to number
							],
						},
						"meals.snack": 1,
						"meals.firstMeal": 1,
						"meals.wasActive": {
							$or: [
								{ $eq: [{ $toBool: "$meals.wasActiveBefore" }, true] }, // Convert wasActiveBefore to boolean
								{ $eq: [{ $toBool: "$meals.wasActiveAfter" }, true] }, // Convert wasActiveAfter to boolean
							],
						},
					},
				},
			];
			const result = await usersData.aggregate(pipeline).toArray();
			const similarMeals = result.map((item) => item.meals);
			return response.status(200).json({ meals: similarMeals });
		} catch (error) {
			console.log(error);
			return response.status(500).json({ error: "Internal Server Error" });
		}
	},
	patchNewMeal: async (request, response) => {
		if (!checkAuthToken(request, response)) return;
		const { username } = request.token;

		const {
			totalCarbs,
			totalBolus,
			bloodSugarBefore,
			firstMeal,
			snack,
			wasActiveBefore,
		} = request.body;

		try {
			const usersData = await connectToDatabase();
			const filter = { username: username };
			const newMeal = {
				id: nanoid(),
				bloodSugarBefore: bloodSugarBefore,
				carbsGrams: totalCarbs,
				bolus: totalBolus,
				firstMeal: firstMeal,
				snack: snack,
				wasActiveBefore: wasActiveBefore,
				time: new Date(),
				bloodSugarAfter: undefined,
				wasActiveAfter: undefined,
			};
			const updatedDoc = {
				$push: {
					meals: newMeal,
				},
			};
			const result = await usersData.updateOne(filter, updatedDoc);
			console.log(
				`Matched ${result.matchedCount} document(s) and updated ${result.modifiedCount} document(s).`
			);
			return response
				.status(200)
				.json({ message: "Successfully added a new meal" });
		} catch (error) {
			console.log(error);
			return response.status(500).json({ error: "Internal Server Error" });
		}
	},
};

module.exports = addMeal2Controller;
