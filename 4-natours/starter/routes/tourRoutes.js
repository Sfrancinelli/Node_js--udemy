const express = require('express');
const fs = require('fs');

// LOAD DATA

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// HANDLERS

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours: tours },
  });
};

const getTour = (req, res) => {
  console.log(req.params);

  const tour = tours.find((tour) => tour.id === parseInt(req.params.id));

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  //   console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) return console.error(err.message);
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  const tourId = req.params.id;
  const updatedFields = req.body;

  console.log(updatedFields);

  // Perform validation and update logic here
  const updatedTour = tours.find((tour) => tour.id === parseInt(tourId));
  if (!updatedTour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }

  // Updating the fields. Checking if the fields that came in the request corresponds to the fields in the actual tour object. If so, updating them.
  for (const key in updatedFields) {
    console.log(updatedTour[key], updatedFields[key]);
    if (key in updatedTour) {
      updatedTour[key] = updatedFields[key];
    }
  }

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) return console.error(err.message);
      res.status(201).json({
        status: 'success',
        data: {
          tour: updatedTour,
        },
      });
    }
  );
};

const deleteTour = (req, res) => {
  const tourId = req.params.id;

  const indexTour = tours.findIndex((tour) => tour.id === parseInt(tourId));
  if (!indexTour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }

  const toursCopy = tours.filter((tour) => tour.id !== parseInt(tourId));

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple-deleted.json`,
    JSON.stringify(toursCopy),
    (err) => {
      if (err) return console.error(err.message);
      console.log('Updated file!');
      res.status(204).json({
        status: 'success',
        message: `Tour deleted succesfully`,
        data: null,
      });
    }
  );
};

// ROUTER
const router = express.Router();

router.route('/').get(getAllTours).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
