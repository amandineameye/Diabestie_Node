const mongoClient = require("../tools/db.tool");

let usersData;

const connectToDatabase = async () => {
	try {
		await mongoClient.connect();
		const database = mongoClient.db("diabestieDB");
		usersData = await database.collection("usersData");
	} catch (error) {
		console.error("Database connection error:", error);
		throw new Error("Database connection failed");
	}
};

connectToDatabase();

const checkAuthToken = (request, response) => {
	if (!request.token) {
		console.log("CheckAuthToken in History controller says: No request.token");
		return false;
	} else {
		return true;
	}
};

const historyController = {
	getMostRecentMeals: async (request, response) => {
		if (!checkAuthToken(request, response)) return;
		const { username } = request.token;

		const { page } = request.query;
		try {
			const pipeline = [
				{ $match: { username: username } },
				{ $unwind: "$meals" },
				{
					$match: {
						"meals.bloodSugarAfter": { $ne: undefined },
						"meals.wasActiveAfter": { $ne: undefined },
					},
				},
				{ $sort: { "meals.time": -1 } },
				{ $skip: (page - 1) * 6 },
				{ $limit: 6 },
				{
					$project: {
						"meals.id": 1,
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
			const mostRecentMeals = result.map((item) => item.meals);
			return response.status(200).json({ meals: mostRecentMeals });
		} catch (error) {
			console.log(error);
			return response.status(500).json({ error: "Internal Server Error" });
		}
	},
	getMostRecentMealsCount: async (request, response) => {
		if (!checkAuthToken(request, response)) return;
		const { username } = request.token;

		try {
			const pipeline = [
				{ $match: { username: username } },
				{ $unwind: "$meals" },
				{
					$match: {
						"meals.bloodSugarAfter": { $ne: undefined },
						"meals.wasActiveAfter": { $ne: undefined },
					},
				},
				{ $count: "totalMeals" },
			];
			const result = await usersData.aggregate(pipeline).toArray();
			const count = result[0]?.totalMeals || 0;
			return response.status(200).json({ count: count });
		} catch (error) {
			console.log(error);
			return response.status(500).json({ error: "Internal Server Error" });
		}
	},
	getFilteredMeals: async (request, response) => {
		if (!checkAuthToken(request, response)) return;
		const { username } = request.token;

		const { unitsTarget, gramsTarget, tag, page = 1 } = request.query;

		const pageNum = Math.max(1, parseInt(page, 10));

		try {
			const basePipeline = [
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
						change: {
							$subtract: [
								{ $toDouble: "$meals.bloodSugarAfter" },
								{ $toDouble: "$meals.bloodSugarBefore" },
							],
						},
					},
				},
				{
					$match: {
						$expr: {
							$switch: {
								branches: [
									{
										case: { $eq: [unitsTarget, "tooMany"] },
										then: { $lt: ["$change", -10] },
									},
									{
										case: { $eq: [unitsTarget, "tooFew"] },
										then: { $gt: ["$change", 10] },
									},
									{
										case: { $eq: [unitsTarget, "right"] },
										then: {
											$and: [
												{ $gte: ["$change", -10] },
												{ $lte: ["$change", 10] },
											],
										},
									},
									{ case: { $eq: [unitsTarget, undefined] }, then: true },
								],
								default: true, // If no match, default case (optional)
							},
						},
					},
				},
				{
					$match: {
						$expr: {
							$switch: {
								branches: [
									{
										case: { $eq: [gramsTarget, "0-30"] },
										then: {
											$and: [
												{ $gte: ["$meals.carbsGrams", 0] },
												{ $lte: ["$meals.carbsGrams", 30] },
											],
										},
									},
									{
										case: { $eq: [gramsTarget, "31-60"] },
										then: {
											$and: [
												{ $gte: ["$meals.carbsGrams", 31] },
												{ $lte: ["$meals.carbsGrams", 60] },
											],
										},
									},
									{
										case: { $eq: [gramsTarget, "61-90"] },
										then: {
											$and: [
												{ $gte: ["$meals.carbsGrams", 61] },
												{ $lte: ["$meals.carbsGrams", 90] },
											],
										},
									},
									{
										case: { $eq: [gramsTarget, "moreThan91"] },
										then: { $gt: ["$meals.carbsGrams", 91] },
									},
									{ case: { $eq: [gramsTarget, undefined] }, then: true }, // Allow all if gramsTarget is undefined
								],
								default: true,
							},
						},
					},
				},
				{
					$match: {
						$expr: {
							$switch: {
								branches: [
									{
										case: { $eq: [tag, "firstMeal"] },
										then: { $eq: ["$meals.firstMeal", true] },
									},
									{
										case: { $eq: [tag, "snack"] },
										then: { $eq: ["$meals.snack", true] },
									},
									{
										case: { $eq: [tag, "wasActive"] },
										then: {
											$or: [
												{ $eq: ["$meals.wasActiveBefore", true] },
												{ $eq: ["$meals.wasActiveAfter", true] },
											],
										},
									},
								],
								default: true, // Pass all meals if no tag is specified
							},
						},
					},
				},
			];

			const countPipeline = [...basePipeline, { $count: "totalCount" }];
			const countResult = await usersData.aggregate(countPipeline).toArray();
			const totalCount = countResult[0]?.totalCount || 0;

			const mealsPipeline = [
				...basePipeline,
				{ $sort: { "meals.time": -1 } },
				{ $skip: (parseInt(pageNum) - 1) * 6 },
				{ $limit: 6 },
				{
					$project: {
						"meals.id": 1,
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

			const mealsResult = await usersData.aggregate(mealsPipeline).toArray();
			const filteredMeals = mealsResult.map((item) => item.meals);

			return response
				.status(200)
				.json({ meals: filteredMeals, count: totalCount });
		} catch (error) {
			console.log(error);
			return response.status(500).json({ error: "Internal Server Error" });
		}
	},
};

module.exports = historyController;
