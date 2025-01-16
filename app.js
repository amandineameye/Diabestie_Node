import express from "express";
const app = express();
import cors from 'cors';
import jwtTool from "./tools/jwt.tool";
import authRouter from './routes/auth.route';
import dashboardRouter from './routes/dashboard.route';
import addMeal1Router from './routes/addMeal1.route;'
import generalRouter from './routes/general.route';
import addMeal2Router from './routes/addMeal2.route';
import historyRouter from './routes/history.route'

const port = process.env.PORT || 8000;



app.use(
	cors({
		origin: "https://diabestie-sooty.vercel.app",
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
		credentials: true, // Allow cookies if needed
		allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
	})
);

// app.use(
// 	cors({
// 		origin: /http:\/\/localhost:\d+$/,
// 		credentials: true,
// 		allowedHeaders: ["Content-Type", "authorization"],
// 	})
// );



app.use((request, response, next) => {
	const authHeader = request.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		console.log("Middleware says: No token");
		next();
		return;
	}

	try {
		console.log(
			"Middleware says: About to try to read and put token in request.token"
		);
		request.token = jwtTool.read(token);
		next();
	} catch (error) {
		console.log("Token decoding error:", error);
		return response.sendStatus(401);
	}
});

app.use(authRouter);
app.use(generalRouter);
app.use(dashboardRouter);
app.use(addMeal1Router);
app.use(addMeal2Router);
app.use(historyRouter);

app.use((err, req, res, next) => {
	console.error("Unhandled error:", err);
	res.status(500).json({ message: "Internal Server Error", error: err.message });
  });

app.listen(port, () => {
	console.log("Server is running and listening on port " + process.env.PORT);
});
