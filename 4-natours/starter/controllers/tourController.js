/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const fs = require('fs');
const Tour = require('../models/tourModel');

// LOAD DATA
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

exports.checkID = (req, res, next, val) => {
  console.log(`Your id is: ${val}`);
  if (val > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  console.log(req.body.name, req.body.price);
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

// HANDLERS
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours: tours },
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);

  const tour = tours.find(
    (curTour) => curTour.id === parseInt(req.params.id, 10),
  );

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  //   console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) return console.error(err.message);
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    },
  );
};

exports.updateTour = (req, res) => {
  const tourId = req.params.id;
  const updatedFields = req.body;

  console.log(updatedFields);

  // Perform validation and update logic here
  const updatedTour = tours.find((tour) => tour.id === parseInt(tourId, 10));

  // Updating the fields. Checking if the fields that came in the request corresponds to the fields in the actual tour object. If so, updating them.
  for (const key in updatedFields) {
    console.log(updatedTour[key], updatedFields[key]);
    if (key in updatedTour) {
      updatedTour[key] = updatedFields[key];
    }
  }

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) return console.error(err.message);
      res.status(201).json({
        status: 'success',
        data: {
          tour: updatedTour,
        },
      });
    },
  );
};

exports.deleteTour = (req, res) => {
  const tourId = req.params.id;

  const toursCopy = tours.filter((tour) => tour.id !== parseInt(tourId, 10));

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple-deleted.json`,
    JSON.stringify(toursCopy),
    (err) => {
      if (err) return console.error(err.message);
      console.log('Updated file!');
      res.status(204).json({
        status: 'success',
        message: `Tour deleted succesfully`,
        data: null,
      });
    },
  );
};
