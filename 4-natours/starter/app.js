const express = require('express');
const app = express();
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');

// MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());
// Middleware to serve static files on the browser
app.use(express.static(`${__dirname}/public`));

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

module.exports = app;
