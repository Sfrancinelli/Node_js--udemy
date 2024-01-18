/* eslint-disable import/newline-after-import */
const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/.config.env` });
const mongoose = require('mongoose');
const app = require('./app');

// Node.js env variables
// console.log(process.env);

/*
// This is for Atlas connection:
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((connection) => {
    console.log(connection.connections);
    console.log('DB Connection succesfull');
  });
*/

// This is for local connection:

mongoose
  .connect('mongodb://127.0.0.1:27017/natours', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB Connection successful');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

const PORT = process.env.PORT || 3000;

// console.log(process.env.PORT);

const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});

// Every unhandled rejection will be handled here. It's the safety net for the unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION, EXITING PROCESS!');
  // Closing the server before shutting down the application to give time to the server to finish the request that are being handled at the moment
  server.close(() => {
    // Exit the process with code 1 (unhandled rejection)
    process.exit(1);
  });
});
