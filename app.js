const express = require('express');
const app = express();
const cors = require('cors');
const jwtTool = require('./tools/jwt.tool');
const authRouter = require('./routes/auth.route');
const dashboardRouter = require('./routes/dashboard.route');
const addMeal1Router = require('./routes/addMeal1.route');
const generalRouter = require('./routes/general.route');
const addMeal2Router = require('./routes/addMeal2.route');
const historyRouter = require('./routes/history.route');
const bodyParser = require('body-parser');

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed HTTP methods
    credentials: true, // Allow cookies if needed
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  })
);

app.use(express.json());
app.use(bodyParser.json());

app.use((request, response, next) => {
  const authHeader = request.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('Middleware says: No token');
    next();
    return;
  }

  try {
    console.log('Token: ', request.token);
    console.log(
      'Middleware says: About to try to read and put token in request.token'
    );
    request.token = jwtTool.read(token);
    next();
  } catch (error) {
    console.log('Token decoding error:', error);
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
  console.error('Unhandled error:', err);
  res
    .status(500)
    .json({ message: 'Internal Server Error', error: err.message });
});

app.listen(process.env.PORT, () => {
  console.log('Server is running and listening on port ' + process.env.PORT);
});
