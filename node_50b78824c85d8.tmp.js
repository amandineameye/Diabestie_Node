const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const jwtTool = require("./tools/jwt.tool");
require("dotenv").config();

const url = "mongodb://127.0.0.1:27017/";
const mongoClient = new MongoClient(url);

app.listen(8000, () => {
	console.log("Server is running and listening on port 8000");
});

app.use(express.json());
app.use(cors());

app.post("/auth/login", (request, response) => {
	handleLogin(request.body, response);
});

const handleLogin = async (reqBodyObject, response) => {
	const { username, password } = reqBodyObject;
	try {
		await mongoClient.connect();
		const database = mongoClient.db("diabestieDB");
		const usersData = database.collection("usersData");
		const options = {
			projection: {},
		};
		const query = {};
		const usersDataArray = await usersData.find(query, options).toArray();

		const userObject = usersDataArray.find((user) => {
			return user.userName === username;
		});

		if (userObject.password !== password) {
			response.status(400).json({ error: "Credentials invalides!" });
			return;
		}

		const data = {
			username: username,
		};

		const token = jwtTool.generate(data);

		response.status(200).json({ token });
	} catch (error) {
		console.log(error);
	}
};

app.get("/allUsersData", (request, response) => {
	findAllUsersData().then((usersData) => {
		response.setHeader("Content-Type", "application/json");
		response.send(usersData);
	});
});

app.get("/userData/:userName", (request, response) => {
	findDataFromUserName(request.params.userName).then((userData) => {
		response.setHeader("Content-Type", "application/json");
		response.send(userData);
	});
});

app.get("/carbsRates", (request, response) => {
	findCarbsRates().then((carbsRates) => {
		response.setHeader("Content-Type", "application/json");
		response.send(carbsRates);
	});
});

const findCarbsRates = async () => {
	try {
		await mongoClient.connect();
		const database = mongoClient.db("diabestieDB");
		const carbsCollection = database.collection("carbsRates");
		const options = {
			projection: {
				_id: 0,
			},
		};
		const query = {};
		const carbsData = await carbsCollection.find(query, options).toArray();
		return carbsData;
	} catch (error) {
		console.error(error);
	}
};

const findDataFromUserName = async (requestedUserName) => {
	try {
		await mongoClient.connect();
		const database = mongoClient.db("diabestieDB");
		const usersData = database.collection("usersData");
		const options = {
			projection: {},
		};
		const query = { userName: requestedUserName };
		const userDataArray = await usersData.find(query, options).toArray();
		return userDataArray[0];
	} catch (error) {
		console.error(error);
	}
};

const findAllUsersData = async () => {
	try {
		await mongoClient.connect();
		const database = mongoClient.db("diabestieDB");
		const usersData = database.collection("usersData");
		const options = {
			projection: {},
		};
		const query = {};
		const usersDataArray = await usersData.find(query, options).toArray();
		return usersDataArray;
	} catch (error) {
		console.error(error);
	}
};
