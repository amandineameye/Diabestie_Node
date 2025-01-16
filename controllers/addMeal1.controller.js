import mongoClient from "../tools/db.tool";

export const connectToDatabase = async () => {
	try {
		await mongoClient.connect();
		const database = mongoClient.db("diabestieDB");
		return database.collection("usersData");
	} catch (error) {
		console.error("Database connection error:", error);
		throw new Error("Database connection failed");
	}
};

export const checkAuthToken = (request, response) => {
	if (!request.token) {
		console.log("CheckAuthToken in AddMeal1 controller says: No request.token");
		return false;
	} else {
		return true;
	}
};

export const addMeal1Controller = {
	getCarbsOptions: async (request, response) => {
		const { inputText } = request.body;

		try {
			await mongoClient.connect();
			const database = mongoClient.db("diabestieDB");
			const carbsCollection = database.collection("carbsRates");

			// Escape special characters in inputText for regex (to interpret literally characters that have a certain meaning in characters)
			const escapedInputText = inputText.replace(
				/([.*+?^=!:${}()|\[\]\/\\])/g,
				"\\$1"
			);

			// Build a regex pattern to match any word that starts with the inputText
			const regexPattern = `\\b${escapedInputText}\\w*`; // \b ensures word boundary, \\w* means what follows can be anything

			const query = {
				carb: { $regex: regexPattern, $options: "i" },
			};
			const options = {
				projection: { _id: 0, carb: 1, carbsRate: 1 },
			};

			const matchingCarbs = await carbsCollection
				.find(query, options)
				.toArray();

			return response.status(200).json({ matchingCarbs: matchingCarbs });
		} catch (error) {
			console.log(error);
			return response.status(500).json({ error: "Internal Server Error" });
		}
	},
};

