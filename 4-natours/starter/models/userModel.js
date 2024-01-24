const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    trim: true,
    required: [true, 'Password required'],
    minlegth: [8, 'The password must have more or equal than 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    trim: true,
    required: [true, 'Password required'],
    minlegth: [8, 'The password must have more or equal than 8 characters'],
    validate: {
      // This will only work on SAVE() and CREATE(). So, when updating an user, it will be neccesary to use the save method to run this validation
      validator: function (el) {
        return this.password === el;
      },
      message: 'The passwords does not match',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  try {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with a cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // The passwordConfirm field is only needed when creating a user fol validation purposes, once it passes the validation, the field is no longer needed and it can be deleted. It's not necessary to hash it to as it will be a intensive CPU process for no reason. The password is the only thing that must be saved and hashed
    this.passwordConfirm = undefined;

    next();
  } catch (err) {
    return next(err);
  }
});

// This is an instance method that is available in the model
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    // console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp; // The timestamp of the generation of the JWT Token must be less than the changed password.
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  // Same as with passwords, its imperative to not save the plain value in the DDBB to avoid hackers from retrieveing the information easily. It needs to be encrypted
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  // Setting the expire date to 10m
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // The function returns the not encrypted token for the email send. This un encrypted token will then be compared with the encrypted one stored in the DDBB for the password reset to work
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
