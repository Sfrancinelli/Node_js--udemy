module.exports = catchAsync = (fn) => {
  // Returns an anonymous function that then gets called when the tour is created, updated or so. Beacuse its a promise, its posible to call the .catch() method in order to hanlde the error
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};
