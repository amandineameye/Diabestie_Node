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
	putNote: async (request, response) => {
		if (!request.body.token) {
			response.sendStatus(401);
			return;
		}
	},
	getMealsSummary: async (request, response) => {
		if (!request.body.token) {
			response.sendStatus(401);
			return;
		}
	},
	getIncompleteMeals: async (request, response) => {
		if (!request.body.token) {
			response.sendStatus(401);
			return;
		}
	},
	patchIcompleteMeals: async (request, response) => {
		if (!request.body.token) {
			response.sendStatus(401);
			return;
		}
	},
};

module.exports = dashBoardController;
