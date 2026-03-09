const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    // Links each message thread to a specific booked session.
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    // User who sent the chat message.
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    // Intended recipient user for this message.
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    // Explicit message-time field (separate from auto-managed createdAt/updatedAt).
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
