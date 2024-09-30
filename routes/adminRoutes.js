const express = require('express');
const router = express.Router();

const {
  viewAllAttandance,
  viewStudentAttandance,
  updateAttandance,
  deleteStudent,
  generateReports,
  getAllStudents,
} = require('../controllers/adminController');

const {
  manageLeaveRequest,
  viewAllLeaveRequests,
} = require('../controllers/leaveRequestController');

const {
  authenticateUser,
  authorizedPermissions,
} = require('../middleware/authentication');

router
  .route('/getStudents')
  .get(authenticateUser, authorizedPermissions('admin'), getAllStudents);

router
  .route('/attendance')
  .get(authenticateUser, authorizedPermissions('admin'), viewAllAttandance);
router
  .route('/attendance-report')
  .get(authenticateUser, authorizedPermissions('admin'), generateReports);

router
  .route('/leave-request')
  .get(authenticateUser, authorizedPermissions('admin'), viewAllLeaveRequests)
  .post(authenticateUser, authorizedPermissions('admin'), manageLeaveRequest);

router
  .route('/deleteStudent/:id')
  .delete(authenticateUser, authorizedPermissions('admin'), deleteStudent);

router
  .route('/attendance/:id')
  .patch(authenticateUser, authorizedPermissions('admin'), updateAttandance)
  .get(authenticateUser, authorizedPermissions('admin'), viewStudentAttandance);

module.exports = router;
