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

const generalController = {
	getUserNames: async (request, response) => {
		if (!checkAuthToken(request, response)) return;
		const { username } = request.token;

		try {
			const usersData = await connectToDatabase();
			const query = {
				username: username,
			};
			const options = {
				projection: {
					_id: 0,
					firstName: 1,
				},
			};
			const firstNameObject = await usersData.findOne(query, options);

			if (!firstNameObject) {
				return response.status(400).json({ error: "Firstname not found" });
			}

			return response
				.status(200)
				.json({ firstName: firstNameObject.firstName, username: username });
		} catch (error) {
			console.log(error);
			return response.status(500).json({ error: "Internal Server Error" });
		}
	},
};

module.exports = generalController;
