const mongoose = require('mongoose');
const validator = require('validator');

/* Email custom validation
const validateEmail = function (email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};
*/

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'An user must have a name'],
    trim: true,
    maxlength: [50, 'A username must have less or equal than 50 characters'],
    minlength: [8, 'The username must have more or equal than 8 characters'],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, 'Email address is required'],
    validate: [validator.isEmail, 'Please fill a valid email address'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
  },
  photo: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
    required: [true, 'Password required'],
    minlegth: [8, 'The password must have more or equal than 8 characters'],
  },
  passwordConfirm: {
    type: String,
    trim: true,
    required: [true, 'Password required'],
    minlegth: [8, 'The password must have more or equal than 8 characters'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
