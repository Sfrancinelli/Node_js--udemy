const express = require('express');
const app = express();
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');

// MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());

// Creating own middleware
/*
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});
*/

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// SERVER
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
