const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Anonymous',
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value))
        throw new Error('Email is not valid');
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: [6, 'Length must be more than six characters']
  },
  age: {
    type: Number,
    default: 18,
    validate(value) {
      if (value < 0)
        throw new Error("Age can't be below 0");
    }
  }
});

// Hash the password before saving
UserSchema.pre('save', async function (next) {
  const user = this;

  // Generate a salt
  const salt = await bcrypt.genSalt(10);

  // Hash the password with the salt
  user.password = await bcrypt.hash(user.password, salt);

  next();
});

UserSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  return user;
};

const User = mongoose.model('User', UserSchema, 'users');

module.exports = User;
