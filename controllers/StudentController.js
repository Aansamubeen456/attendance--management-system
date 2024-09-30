const Attandance = require('../models/Attandance');
const User = require('../models/User');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');

const getProfile = async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) {
    throw new CustomError.NotFoundError('Not found the user');
  }
  res.status(StatusCodes.OK).json({ user });
};

const updateProfile = async (req, res) => {
  const { name, email } = req.body;

  const user = await User.findById(req.user.userId);
  if (!user) {
    throw new CustomError.NotFoundError('Not found the user');
  }

  user.name = name || user.name;
  user.email = email || user.email;

  await user.save();
  const token = user.generateToken();

  res.status(StatusCodes.OK).json({ user, token });
};

const markAttandance = async (req, res) => {
  const { status } = req.body;
  const markedBy = req.user.userId;

  // Get today's date in 'YYYY-MM-DD' format
  const today = new Date().toISOString().split('T')[0];

  // Check if attendance has already been marked for today
  const attandanceMarked = await Attandance.findOne({
    markedBy,
    date: { $gte: new Date(today) },
  });

  if (attandanceMarked) {
    throw new CustomError.BadRequestError(
      'Attendance has already been marked for today.'
    );
  }

  const attandance = await Attandance.create({
    status,
    markedBy,
    date: new Date(),
  });

  res.status(StatusCodes.CREATED).json({
    attandance: attandance,
    msg: 'Attendance marked successfully',
  });
};

const getAllAttendance = async (req, res) => {
  const attendance = await Attandance.find({ markedBy: req.user.userId });

  if (!attendance) {
    throw new CustomError.BadRequestError('No attendance found.');
  }
  res.status(StatusCodes.OK).json({ count: attendance.length, attendance });
};

module.exports = {
  getProfile,
  updateProfile,
  markAttandance,
  getAllAttendance,
};
