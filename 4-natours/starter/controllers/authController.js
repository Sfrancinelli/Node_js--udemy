const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const { promisify } = require('util');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email: email }).select('+password');
  // To select a field that is explicity unselected in the model (to hide it from the get responses), its imperative to write a plus sign before the name of the field
  console.log(user);

  // Its possible to use the instance method of the userModel because the user in this case its an instance of the model itself (as we use the User.findOne)
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1) Getting JWT token and check if it exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  //   console.log(token);

  // If no token found, it means that the user its not logged in and should not access our routes
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to continue', 401),
    );
  }
  // 2) Verification of the JWT token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  // 3) Check if user using the route still exists
  const freshUser = await User.findById(decoded.id);

  if (!freshUser)
    return next(
      new AppError('The user belonging to this token no longer exists!'),
    );

  // 4) Check if user changed password after the JWT token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Pleae log in again!', 401),
    );
  }

  req.user = freshUser;
  // Next will be executed only if the function passes all the if statements of course. This next, GRANTS ACCESS TO THE PROTECTED ROUTE
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Roles ['admin', 'lead-guide']. role='user'
    // This if statement is checking if the user.role is contained in the roles array. The roles array is as said above, ['admin', 'lead-guide']. If the user has the role property set to admin, the function will call next. Same with lead guide. But if the role is 'user', the includes method will not find that in the array, leading to the AppError
    // The roles array gets to the middleware function from the wrapper function beacuse of a clousure
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }

    next();
  };
};
