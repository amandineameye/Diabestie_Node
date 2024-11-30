const mongoClient = require("../tools/db.tool");

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
		return response
			.sendStatus(401)
			.json({ error: "Unauthorized: Missing or invalid token" }); //Request require authentification
		// return false;
	} else {
		return true;
	}
};

const dashBoardController = {
	getNote: async (request, response) => {
		if (!checkAuthToken(request, response)) return; //If checkAuthToken (with request and response as arguments) is false, return
		const { username } = request.token; // const username = request.token.username

		try {
			const usersData = await connectToDatabase();
			const options = {
				projection: { _id: 0, note: 1 },
			};
			const query = {
				username: username,
			};
			const userNote = await usersData.findOne(query, options);

			if (!userNote) {
				return response.status(400).json({ error: "Note not found" });
			}

			return response.status(200).json({ note: userNote.note });
		} catch (error) {
			console.log(error);
			return response.status(500).json({ error: "Internal Server Error" });
		}
	},
	patchNote: async (request, response) => {
		if (!checkAuthToken(request, response)) return;
		const { username } = request.token;
		const updatedNote = request.body.updatedNote;

		try {
			const usersData = await connectToDatabase();
			const filter = { username: username };
			const updatedDoc = {
				$set: { note: updatedNote },
			};
			const result = await usersData.updateOne(filter, updatedDoc);
			console.log(
				`Matched ${result.matchedCount} document(s) and updated ${result.modifiedCount} document(s).`
			);
			return response.status(200).json({ message: "Successful update" });
		} catch (error) {
			console.log(error);
			return response.status(500).json({ error: "Internal Server Error" });
		}
	},
	getMealsSummary: async (request, response) => {
		if (!checkAuthToken(request, response)) return;
		const { username } = request.token;

		try {
			const usersData = await connectToDatabase();
			const result = await usersData
				.aggregate([
					{ $match: { username: username } },
					{ $unwind: "$meals" },
					{
						$match: {
							"meals.bloodSugarAfter": { $ne: undefined },
							"meals.wasActiveAfter": { $ne: undefined },
						},
					},
					{ $sort: { "meals.time": -1 } },
					{ $limit: 5 },
					{
						$project: {
							_id: 0,
							"meals.carbsGrams": 1,
							"meals.bolus": 1,
							"meals.bloodSugarBefore": 1,
							"meals.bloodSugarAfter": 1,
							"meals.id": 1,
						},
					},
				])
				.toArray();

			const recentMeals = result.map((item) => item.meals);
			return response.status(200).json({ meals: recentMeals });
		} catch (error) {
			console.log(error);
			return response.status(500).json({ error: "Internal Server Error" });
		}
	},
	getIncompleteMeals: async (request, response) => {
		if (!checkAuthToken(request, response)) return;
		const { username } = request.token;

		try {
			const usersData = await connectToDatabase();
			const result = await usersData
				.aggregate([
					{ $match: { username: username } },
					{ $unwind: "$meals" },
					{
						$match: {
							$or: [
								{ "meals.bloodSugarAfter": { $in: [null, undefined] } },
								{ "meals.wasActiveAfter": { $in: [null, undefined] } },
							],
						},
					},
					{ $sort: { "meals.time": 1 } },
					{
						$project: {
							_id: 0,
							"meals.id": 1,
							"meals.time": 1,
						},
					},
				])
				.toArray();
			const incompleteMeals = result.map((item) => item.meals);
			return response.status(200).json({ meals: incompleteMeals });
		} catch (error) {
			console.log(error);
			return response.status(500).json({ error: "Internal Server Error" });
		}
	},
	patchIncompleteMeals: async (request, response) => {
		if (!checkAuthToken(request, response)) return;
		const { username } = request.token;
		const { mealId, bloodSugarAfter, wasActiveAfter } = request.body;

		try {
			const usersData = await connectToDatabase();
			const filter = { username: username };
			const updatedDoc = {
				$set: {
					"meals.$[targetMeal].bloodSugarAfter": bloodSugarAfter,
					"meals.$[targetMeal].wasActiveAfter": wasActiveAfter,
				},
			};
			const options = {
				arrayFilters: [{ "targetMeal.id": mealId }],
			};

			const result = await usersData.updateOne(filter, updatedDoc, options);
			console.log(
				`Matched ${result.matchedCount} document(s) and updated ${result.modifiedCount} document(s).`
			);
			return response.status(200).json({ message: "Successful update" });
		} catch (error) {
			console.log(error);
			return response.status(500).json({ error: "Internal Server Error" });
		}
	},
};

module.exports = dashBoardController;
