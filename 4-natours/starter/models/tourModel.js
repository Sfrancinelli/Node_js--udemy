const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      trim: true,
      unique: true,
    },
    duration: {
      type: Number,
      required: [true, 'A tours must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },
    ratingsAverage: {
      type: Number,
      default: 0,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      required: [true, 'A tour must have a summary'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
      trim: true,
    },
    images: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: {
      type: [Date],
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function (next) {
  // console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});

/*
// It is possible to have multiple document middlewares
tourSchema.pre('save', function (next) {
  console.log('Will save document...');
  next();
});

// Runs After .save()
tourSchema.post('save', function (doc, next) {
  console.log(doc), next();
});
*/

// QUERY MIDDLEWARE: The difference its that now we're targetting a query and not a document
// The regular expresion /^find/ searchs for any method that starts with find. find(), findOne(), findOneAndRemove(), etc..
// tourSchema.pre(/^find/, function (next) {
//   this.find({ secretTour: { $ne: true } });

//   this.start = Date.now();

//   next();
// });
// The code above changes the result of querying the tours in the API. This happens because in the tourController.js, in the methods that query the objects, the find() method its used. So, this QUERY MIDDLEWARE happens before ssaid method is executed

// The post runs after the find method is executed
// tourSchema.post(/^find/, function (docs, next) {
//   // console.log(docs);

//   console.log(`Query took ${Date.now() - this.start} miliseconds`);

//   next();
// });

// AGREGATION MIDDLEWARE. The aggregation middleware specifies a condition for the aggregation of results in a model level. In this case, this agregation middleware is hiding the tours with the secretTour property set to true. But its possible to do any kind of aggregation from this middleware.
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: false } } });

  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

/*

const testTour = new Tour({
  name: 'The Ocean Swimmer',
  rating: 4.7,
  price: 497,
});

// SERVER
testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log(err.message);
  });

*/
