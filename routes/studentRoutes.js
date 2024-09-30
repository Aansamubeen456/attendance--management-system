const express = require('express');
const router = express.Router();

const {
  getProfile,
  updateProfile,
  markAttandance,
  getAllAttendance,
} = require('../controllers/StudentController');

const {
  leaveRequest,
  viewLeaveRequest,
} = require('../controllers/leaveRequestController');

const { authenticateUser } = require('../middleware/authentication');

router.route('/getProfile').get(authenticateUser, getProfile);
router.route('/getAttendanceList').get(authenticateUser, getAllAttendance);
router.route('/updateProfile').post(authenticateUser, updateProfile);
router.route('/markAttandance').post(authenticateUser, markAttandance);

router
  .route('/leaveRequest')
  .post(authenticateUser, leaveRequest)
  .get(authenticateUser, viewLeaveRequest);

module.exports = router;
