const mongoClient = require("../tools/db.tool");

const dashBoardController = {
	getNote: async (request, response) => {
		if (!request.token) {
			response.sendStatus(401); //Request require authentification
			return;
		}
		const username = request.token.username;

		try {
			await mongoClient.connect();
			const database = mongoClient.db("diabestieDB");
			const usersData = database.collection("usersData");
			const options = {
				projection: { _id: 0, note: 1 },
			};
			const query = {
				username: username,
			};
			const userNote = await usersData.findOne(query, options);

			if (!userNote) {
				response.status(400).json({ error: "Note not found" });
			}

			response.status(200).json({ note: userNote.note });
		} catch (error) {
			console.log(error);
			response.status(500).json({ error: "Internal Server Error" });
		}
	},
	patchNote: async (request, response) => {
		if (!request.token) {
			response.sendStatus(401);
			return;
		}
		const username = request.token.username;
		const updatedNote = request.body.updatedNote;

		try {
			await mongoClient.connect();
			const database = mongoClient.db("diabestieDB");
			const usersData = database.collection("usersData");
			const filter = { username: username };
			const updatedDoc = {
				$set: { note: updatedNote },
			};
			const result = await usersData.updateOne(filter, updatedDoc);
			console.log(
				`Matched ${result.matchedCount} document(s) and updated ${result.modifiedCount} document(s).`
			);
		} catch (error) {
			console.log(error);
			response.status(500).json({ error: "Internal Server Error" });
		}
	},
	getMealsSummary: async (request, response) => {
		if (!request.token) {
			response.sendStatus(401);
			return;
		}
		const username = request.token.username;

		try {
			await mongoClient.connect();
			const database = mongoClient.db("diabestieDB");
			const usersData = database.collection("usersData");
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
					{ $sort: { "meals.date": -1 } },
					{ $limit: 6 },
					{
						$project: {
							_id: 0,
							"meals.carbsGrams": 1,
							"meals.bolus": 1,
							"meals.bloodSugarBefore": 1,
							"meals.bloodSugarAfter": 1,
						},
					},
				])
				.toArray();

			const recentMeals = result.map((item) => item.meals);
			response.status(200).json({ meals: recentMeals });
		} catch (error) {
			console.log(error);
			response.status(500).json({ error: "Internal Server Error" });
		}
	},
	getIncompleteMeals: async (request, response) => {
		if (!request.token) {
			response.sendStatus(401);
			return;
		}
		const username = request.token.username;

		try {
			await mongoClient.connect();
			const database = mongoClient.db("diabestieDB");
			const usersData = database.collection("usersData");
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
					{ $sort: { "meals.date": 1 } },
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
			response.status(200).json({ meals: incompleteMeals });
		} catch (error) {
			console.log(error);
			response.status(500).json({ error: "Internal Server Error" });
		}
	},
	patchIcompleteMeals: async (request, response) => {
		if (!request.token) {
			response.sendStatus(401);
			return;
		}
	},
};

module.exports = dashBoardController;
