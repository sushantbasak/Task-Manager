const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

//By placing unique indexes created in database which ensure uniqueness

//methods -> instances/documents
//statics -> model

// With the help of statics we can access all the available documents but with the help of
// methods we can access only the current document

// Schema -> Instance of the current document
// Model -> With it we can also add custom made function which helps in direct quering

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error('Email is not valid ');
      },
    },
    age: {
      type: Number,
      validate(value) {
        if (value < 0) throw new Error('Age must be a positive number');
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,

      validate(value) {
        if (value == 'password') throw new Error("Can't be password");
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual Property
// Its a relationship between two entities
// ref -> Referenced relation, localfield -> Relation between both these, foreignField -> Name of field in referenced collection
// These are not stored in database when connection is set up

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
});

userSchema.methods.toJSON = function () {
  const user = this;

  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id.toString() }, 'Helllo World');

  user.tokens = user.tokens.concat({ token });

  await user.save();

  return token;
};

//This function can be directly accessed from the mongoose model
//Statics are for models while methods are for instances
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error('Unable to login');

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error('Unable to login');

  return user;
};

//Function used instead of arrow notation as it helps in binding and thus helps in accessing the object.
// Next is used so that  schema should know what should it do to perform the operation after the following one completed.

userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
