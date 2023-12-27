/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const Tour = require('../models/tourModel');

// HANDLERS
exports.getAllTours = async (req, res) => {
  // Getting all the data from the DB
  try {
    const tours = await Tour.find();

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours: tours },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // The above is the same as: Tour.findOne({ _id: req.params.id })

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
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
  res.status(201).json({
    status: 'success',
    // data: {
    //   tour: updatedTour,
    // },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    message: `Tour deleted succesfully`,
    data: null,
  });
};
