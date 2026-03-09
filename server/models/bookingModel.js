const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Learner who created the booking request.
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Expert account receiving the consultation request.
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  day: {
    type: String, // e.g., "2026-01-10"
    required: true,
  },
  slot: {
    // Stored as "HH:mm" strings; compared in controllers using IST helper functions.
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
  },
  status: {
    type: String,
    // Core booking lifecycle state (request -> decision -> completion).
    enum: ['pending', 'accepted', 'rejected', 'paid', 'completed', 'incomplete'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    // Payment tracking flag kept separate from booking lifecycle state.
    enum: ['pending', 'paid'],
    default: 'pending',
  },
  amount: {
    type: Number,
    required: true,
  },
  bookedAt: {
    type: Date,
    default: Date.now,
  },
  report: {
    // User-submitted moderation report metadata for this session.
    reason: { type: String },
    reportedAt: { type: Date }
  },
  // One-time flags used by review/report flows.
  isReviewed: { type: Boolean, default: false },
  isReported: { type: Boolean, default: false },
  rejectionReason: {
  type: String,
  default: ""},
  topic: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
