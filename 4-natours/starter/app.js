const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours: tours },
  });
};

const getTour = (req, res) => {
  console.log(req.params);

  //   if (parseInt(req.params.id) > tours.length) {
  //     return res.status(404).json({
  //       status: 'fail',
  //       message: 'Invalid ID',
  //     });
  //   }

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

//////////////////////////////////////////////////////////////////
// ROUTES

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

/* OLD WAY
app.get('/api/v1/tours', getAllTours);
// To get a variable in the URL the : its needed: /api/v1/tours/:id.
// If the parameter needs to be optional, a ? its needed: /api/v1/tours/:optional?
app.get('/api/v1/tours/:id', getTour);
app.post('/api/v1/tours', createTour);
app.patch('/api/v1/tours/:id', updateTour);
// DELETE not really working given the static nature of the data
// The data keeps renovating itself but it deletes the element specified
app.delete('/api/v1/tours/:id', deleteTour);
*/

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
