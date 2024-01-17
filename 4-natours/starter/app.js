const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorController');

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

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

// If the code reaches here it means thtat none of the routers were able to catch the request (unhandled routes)
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handler middleware
app.use(errorHandler);

module.exports = app;
