const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema(
  {
    from: {
      type: Date,
      required: [true, 'Please provide date'],
    },
    to: {
      type: Date,
      required: [true, 'Please provide date'],
    },
    reason: {
      type: String,
      required: [true, 'Please provide reason'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    requestBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
