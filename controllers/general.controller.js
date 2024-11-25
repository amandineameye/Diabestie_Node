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
		response.sendStatus(401); //Request require authentification
		return false;
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
				response.status(400).json({ error: "Firstname not found" });
			}

			response
				.status(200)
				.json({ firstName: firstNameObject.firstName, username: username });
		} catch (error) {
			console.log(error);
			response.status(500).json({ error: "Internal Server Error" });
		}
	},
};

module.exports = generalController;
