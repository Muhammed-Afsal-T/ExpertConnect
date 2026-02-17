const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  expertId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  message: { type: String, required: true },
  userName: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);