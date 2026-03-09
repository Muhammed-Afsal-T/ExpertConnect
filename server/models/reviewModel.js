const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // Expert receiving the rating/review.
  expertId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // User who authored the review.
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Booking reference ensures review is tied to a real consultation.
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  // Rating constrained to 1-5 stars.
  rating: { type: Number, required: true, min: 1, max: 5 },
  message: { type: String, required: true },
  // Denormalized display name for lightweight UI rendering.
  userName: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
