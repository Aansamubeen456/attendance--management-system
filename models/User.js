const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Attendance = require('./Attandance');
const Leave = require('./LeaveRequest');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 50,
  },

  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide valid email',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'student'],
    default: 'student',
  },
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function () {
    let userId = this._id;
    userId = userId.toString();
    await Attendance.deleteMany({ markedBy: userId });
    await Leave.deleteMany({ requestBy: userId });
  }
);

userSchema.methods.getName = function () {
  return this.name;
};

userSchema.methods.generateToken = function () {
  return jwt.sign(
    { name: this.name, userId: this._id, role: this.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

userSchema.methods.comparePassword = async function (candidatePassword) {
  const password = await bcrypt.compare(candidatePassword, this.password);
  return password;
};

module.exports = mongoose.model('User', userSchema);
