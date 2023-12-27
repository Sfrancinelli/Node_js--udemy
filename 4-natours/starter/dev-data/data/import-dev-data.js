const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => console.log('DB connection successful!'));

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

// IMPORT DATA INTOD DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data succesfully loaded!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv.includes('--import')) {
  importData();
  console.log('imported data');
} else if (process.argv.includes('--delete')) {
  deleteData();
  console.log('deleted data');
}

// console.log(process.argv);
