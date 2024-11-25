const express = require("express");
const app = express();
const cors = require("cors");
const jwtTool = require("./tools/jwt.tool");
const authRouter = require("./routes/auth.route");
const dashboardRouter = require("./routes/dashboard.route");
const addMeal1Router = require("./routes/addMeal1.route");
const generalRouter = require("./routes/general.route");

app.listen(process.env.PORT, () => {
	console.log("Server is running and listening on port " + process.env.PORT);
});

app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
		allowedHeaders: ["Content-Type", "authorization"],
	})
);

app.use((request, response, next) => {
	const authHeader = request.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		next();
		return;
	}

	try {
		request.token = jwtTool.read(token);
	} catch (error) {
		console.log("Token decoding error:", error);
		return response.sendStatus(401);
	}
	next();
});

app.use(authRouter);
app.use(dashboardRouter);
app.use(addMeal1Router);
app.use(generalRouter);

// app.post("/auth/login", (request, response) => {
// 	handleLogin(request.body, response);
// });

// const handleLogin = async (reqBodyObject, response) => {
// 	const { username, password } = reqBodyObject;
// 	try {
// 		await mongoClient.connect();
// 		const database = mongoClient.db("diabestieDB");
// 		const usersData = database.collection("usersData");
// 		const options = {
// 			projection: {},
// 		};
// 		const query = {};
// 		const usersDataArray = await usersData.find(query, options).toArray();

// 		const userObject = usersDataArray.find((user) => {
// 			return user.username === username;
// 		});

// 		if (!userObject) {
// 			response.status(400).json({ error: "Username not found" });
// 			return;
// 		}

// 		if (userObject.password !== password) {
// 			response.status(400).json({ error: "Wrong password" });
// 			return;
// 		}

// 		const data = {
// 			username: username,
// 		};

// 		const token = jwtTool.generate(data);

// 		response.status(200).json({ token: token });
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

// app.get("/allUsersData", (request, response) => {
// 	findAllUsersData().then((usersData) => {
// 		response.setHeader("Content-Type", "application/json");
// 		response.send(usersData);
// 	});
// });

// app.get("/userData", (request, response) => {
// 	if (!request.token) {
// 		response.sendStatus(401);
// 		return;
// 	}
// 	const username = request.token.username;
// 	findDataFromUsername(username).then((userData) => {
// 		response.setHeader("Content-Type", "application/json");
// 		response.send(userData);
// 	});
// });

// app.get("/carbsRates", (request, response) => {
// 	findCarbsRates().then((carbsRates) => {
// 		response.setHeader("Content-Type", "application/json");
// 		response.send(carbsRates);
// 	});
// });

// const findCarbsRates = async () => {
// 	try {
// 		await mongoClient.connect();
// 		const database = mongoClient.db("diabestieDB");
// 		const carbsCollection = database.collection("carbsRates");
// 		const options = {
// 			projection: {
// 				_id: 0,
// 			},
// 		};
// 		const query = {};
// 		const carbsData = await carbsCollection.find(query, options).toArray();
// 		return carbsData;
// 	} catch (error) {
// 		console.error(error);
// 	}
// };

// const findDataFromUsername = async (requestedUsername) => {
// 	try {
// 		await mongoClient.connect();
// 		const database = mongoClient.db("diabestieDB");
// 		const usersData = database.collection("usersData");
// 		const options = {
// 			projection: {},
// 		};
// 		const query = { username: requestedUsername };
// 		const userDataArray = await usersData.find(query, options).toArray();
// 		return userDataArray[0];
// 	} catch (error) {
// 		console.error(error);
// 	}
// };

// const findAllUsersData = async () => {
// 	try {
// 		await mongoClient.connect();
// 		const database = mongoClient.db("diabestieDB");
// 		const usersData = database.collection("usersData");
// 		const options = {
// 			projection: {},
// 		};
// 		const query = {};
// 		const usersDataArray = await usersData.find(query, options).toArray();
// 		return usersDataArray;
// 	} catch (error) {
// 		console.error(error);
// 	}
// };

// const findMealFromUsername = async (requestedUsername) => {
// 	try {
// 		await mongoClient.connect();
// 		const database = mongoClient.db("diabestieDB");
// 		const usersData = database.collection("usersData");
// 		const options = {
// 			projection: {},
// 		};
// 		const query = { username: requestedUsername };
// 		const userDataArray = await usersData.find(query, options).toArray();
// 		return userDataArray[0];
// 	} catch (error) {
// 		console.error(error);
// 	}
// };
