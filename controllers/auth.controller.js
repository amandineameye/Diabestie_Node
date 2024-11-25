const jwtTool = require("../tools/jwt.tool");
const mongoClient = require("../tools/db.tool");

const authController = {
	login: async (request, response) => {
		const { username, password } = request.body;
		try {
			await mongoClient.connect();
			const database = mongoClient.db("diabestieDB");
			const usersData = database.collection("usersData");
			const options = {
				projection: { password: 1, _id: 0 },
			};
			const query = { username: username };
			const userObject = await usersData.findOne(query, options);

			//  Ex: {password: 'myPassword98'}

			if (!userObject) {
				response.status(400).json({ message: "Username not found" });
				return;
			}

			if (userObject.password !== password) {
				response.status(400).json({ message: "Wrong password" });
				return;
			}

			const data = {
				username: username,
			};

			const token = jwtTool.generate(data);

			response.status(200).json({ token: token });
		} catch (error) {
			console.log(error);

			response.status(500).json({ message: "Internal Server Error" });
		}
	},
	register: async (request, response) => {
		const { username, password, firstName } = request.body;
		try {
			await mongoClient.connect();
			const database = mongoClient.db("diabestieDB");
			const usersData = database.collection("usersData");
			const options = {
				projection: { username: 1, _id: 0 },
			};
			const query = { username: username };
			const existingUser = await usersData.findOne(query, options);

			if (existingUser) {
				response.status(400).json({ message: "Username already exists" });
				return;
			}

			const newUser = {
				firstName: firstName,
				username: username,
				password: password,
				note: undefined,
				meals: [],
			};

			const result = await usersData.insertOne(newUser);

			const data = {
				username: username,
			};

			const token = jwtTool.generate(data);

			response.status(200).json({
				message: "User registered successfully",
				userId: result.insertedId,
				token: token,
			});
		} catch (error) {
			console.log(error);

			response.status(500).json({ message: "Internal Server Error" });
		}
	},
};

module.exports = authController;
