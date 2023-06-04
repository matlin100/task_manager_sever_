const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('./task')

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
  },
  avatar: {
    type: String // Store the URL or reference to the image file
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
},{
  timestamps: true
});

UserSchema.virtual('tasks', {
  ref:'Task',
  localField:'_id',
  foreignField:'owner'
})

UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.tokens;
  return user;
};

UserSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
    } catch (error) {
      return next(error);
    }
  }
  next();
});


UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'my_secret_key');
  user.tokens.push({ token });
  await user.save();
  return token;
};

UserSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }
 
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = await user.generateAuthToken();
  
  return { user, token };
};

const User = mongoose.model('User', UserSchema, 'users');

module.exports = User;
