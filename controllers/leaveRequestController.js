const User = require('../models/User');
const LeaveModel = require('../models/LeaveRequest');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');

const leaveRequest = async (req, res) => {
  const { from, to, reason } = req.body;
  const requestBy = req.user.userId;

  if (!from || !to || !reason) {
    throw new CustomError.BadRequestError('Please provide all values');
  }

  const leave = await LeaveModel.create({
    from: new Date(from),
    to: new Date(to),
    reason,
    requestBy,
  });

  res.status(StatusCodes.CREATED).json({
    leave,
  });
};

const viewLeaveRequest = async (req, res) => {
  res.send('view leave reqeuest');
};

const viewAllLeaveRequests = async (req, res) => {
  res.send('view all leave reqeuests');
};

const manageLeaveRequest = async (req, res) => {
  res.send('approve or reject leave reqeuests');
};

module.exports = {
  leaveRequest,
  viewLeaveRequest,
  manageLeaveRequest,
  viewAllLeaveRequests,
};
