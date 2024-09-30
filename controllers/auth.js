const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const isEmailExists = await User.findOne({ email });

  // check email
  if (isEmailExists) {
    throw new CustomError.BadRequestError(
      'User with this email already exist.'
    );
  }

  if (!name || !password) {
    throw new CustomError.BadRequestError(
      'Please provide firstName, lastName and password'
    );
  }

  // set first user as admin only
  const firstUser = (await User.countDocuments({})) === 0;
  const role = firstUser ? 'admin' : 'student';

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  const token = user.generateToken();

  res.status(StatusCodes.CREATED).json({ user, token });

  //  res
  //    .status(StatusCodes.CREATED)
  //    .json({ user: { name: user.firstName }, token });
};

const login = async (req, res) => {
  const { password, email } = req.body;

  if (!password || !email) {
    throw new CustomError.BadRequestError('Please provide both values.');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials.');
  }

  const isCorrectPassword = await user.comparePassword(password);
  if (!isCorrectPassword) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials.');
  }

  const token = user.generateToken();
  res.status(StatusCodes.OK).json({ user, token });

  // res.status(StatusCodes.OK).json({ user: { name: user.firstName }, token });
};

module.exports = {
  register,
  login,
};
