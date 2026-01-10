const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
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
    startTime: { type: String, required: true }, // തിരഞ്ഞെടുത്ത സ്ലോട്ടിന്റെ തുടക്കം
    endTime: { type: String, required: true }    // തിരഞ്ഞെടുത്ത സ്ലോട്ടിന്റെ അവസാനം
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
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
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);