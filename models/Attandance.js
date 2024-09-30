const mongoose = require('mongoose');

const attandanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late'],
      required: [true, 'Please provide status'],
    },

    markedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', attandanceSchema);
