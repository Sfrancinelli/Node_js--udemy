/* eslint-disable import/newline-after-import */
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const mongoose = require('mongoose');

// Node.js env variables
// console.log(process.env);

// This is for Atlas connection:
/*
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

// SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
