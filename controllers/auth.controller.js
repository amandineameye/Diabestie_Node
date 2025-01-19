const jwtTool = require("../tools/jwt.tool");
const mongoClient = require("../tools/db.tool");

const authController = {
	login: async (request, response) => {
		console.log("Entered login route");
		const { username, password } = request.body;
		console.log("Request.body: ", username, password);
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
				return response.status(400).json({ message: "Username not found" });
			} else {
				console.log("User object: ", userObject);
			}

			if (userObject.password !== password) {
				return response.status(400).json({ message: "Wrong password" });
			}

			const data = {
				username: username,
			};

			console.log("About to generate a token in login route");
			const token = await jwtTool.generate(data);

			return response.status(200).json({ token: token });
		} catch (error) {
			console.log(error);

			return response.status(500).json({ message: "Internal Server Error" });
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
				return response
					.status(400)
					.json({ message: "Username already exists" });
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

			return response.status(200).json({
				message: "User registered successfully",
				userId: result.insertedId,
				token: token,
			});
		} catch (error) {
			console.log(error);

			return response.status(500).json({ message: "Internal Server Error" });
		}
	},
};

module.exports = authController;
