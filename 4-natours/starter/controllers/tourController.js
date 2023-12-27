/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const fs = require('fs');
const Tour = require('../models/tourModel');

// LOAD DATA
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

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

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
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
