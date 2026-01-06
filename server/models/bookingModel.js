const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ബുക്ക് ചെയ്യുന്ന യൂസർ
    required: true,
  },
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ബുക്ക് ചെയ്യപ്പെടുന്ന എക്സ്പെർട്ട്
    required: true,
  },
  day: {
    type: String,
    required: true,
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