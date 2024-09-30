const Attendance = require('../models/Attandance');
const User = require('../models/User');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');

const getAllStudents = async (req, res) => {
  const students = await User.find({ role: { $ne: 'admin' } }).sort({
    _id: -1,
  });

  if (!students) {
    throw new CustomError.NotFoundError('No student found.');
  }

  res.status(StatusCodes.OK).json({ count: students.length, students });
};

const viewAllAttandance = async (req, res) => {
  const attendance = await Attendance.find({}).sort('createdAt');

  res.status(StatusCodes.OK).json({ count: attendance.length, attendance });
};

const viewStudentAttandance = async (req, res) => {
  const { id: attendanceId } = req.params;

  const attendance = await Attendance.findById({ _id: attendanceId });

  if (!attendance) {
    throw new CustomError.NotFoundError(
      `Not found the attendance with id: ${id}`
    );
  }
  res.status(StatusCodes.OK).json({ attendance });
};

const updateAttandance = async (req, res) => {
  const {
    body: { status, date },
    params: { id: attendanceId },
  } = req;

  if (!status || !date) {
    throw new CustomError.BadRequestError('Please provide both values');
  }

  const attendance = await Attendance.findOneAndUpdate(
    { _id: attendanceId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!attendance) {
    throw new NotFoundError(
      `Attendance with id: ${attendanceId} does not exist`
    );
  }

  res.status(StatusCodes.OK).json(attendance);
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;
  const student = await User.findById({ _id: id });

  if (!student) {
    throw new NotFoundError(`No student found with id: ${id} does not exist`);
  }

  await student.deleteOne();
  res.status(StatusCodes.OK).json({ msg: 'Student deleted successfully' });
};

const generateReports = async (req, res) => {
  const report = await Attendance.aggregate([
    {
      // Group by the user (student) who marked the attendance
      $group: {
        _id: '$markedBy', // Group by student ID (markedBy)
        totalDays: { $sum: 1 }, // Count total attendance records
        presentDays: {
          $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] }, // Count 'present' days
        },
        absentDays: {
          $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] }, // Count 'absent' days
        },
        lateDays: {
          $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] }, // Count 'late' days
        },
      },
    },
    {
      // Project the final report structure
      $project: {
        _id: 0, // Exclude _id from output
        studentId: '$_id', // Renaming _id to studentId
        totalDays: 1,
        presentDays: 1,
        absentDays: 1,
        lateDays: 1,
        attendancePercentage: {
          $multiply: [{ $divide: ['$presentDays', '$totalDays'] }, 100], // Calculate attendance percentage
        },
      },
    },
  ]);
  res.status(StatusCodes.OK).json({ AttendanceReport: report });
};

module.exports = {
  viewAllAttandance,
  viewStudentAttandance,
  updateAttandance,
  deleteStudent,
  generateReports,
  getAllStudents,
};
