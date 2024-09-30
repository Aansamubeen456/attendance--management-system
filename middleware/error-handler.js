const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'something went wrong pelase try again later.',
  };

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }

  // check for validation error
  if (err.name === 'ValidationError') {
    // console.log(Object.values(err.errors)); return an array
    customError.msg = Object.values(err.errors)
      .map((item) => {
        return item.message;
      })
      .join(',');
    customError.statusCode = 400;
  }

  // check for cast error. specifically when sending id and user mess with syntax
  if (err.name === 'CastError') {
    customError.msg = `No Student found with the id: ${err.value}`;
    customError.statusCode = 404;
  }

  // duplicate email error
  if (err.code && err.code === 11000) {
    customError.statusCode = 400;
    customError.msg = `User with the ${Object.keys(
      err.keyValue
    )} already exist. Please try with another ${Object.keys(err.keyValue)}.`;
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
