const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Shared identity/auth fields.
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Role controls access across user/expert/admin flows.
  role: { type: String, enum: ['user', 'expert', 'admin'], default: 'user' },
  image: { type: String, default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg' },
  
  // Expert profile fields used in discovery and booking screens.
  specialization: { type: String },
  experience: { type: Number },
  fees: { type: Number },
  about: { type: String },
  // Set by admin approval workflow before expert is publicly listed.
  isVerified: { type: Boolean, default: false },
  certificates: { type: String }, 
  idProof: { type: String },      
  
  // Denormalized aggregates updated when new reviews are posted.
  averageRating: { type: Number, default: 0 }, 
  numReviews: { type: Number, default: 0 },

  // Expert availability calendar grouped by day and time slots.
  availability: [
    {
      date: { type: String }, // Format: "YYYY-MM-DD"
      slots: [
        {
          // Expected "HH:mm" 24-hour format for controller comparisons.
          startTime: { type: String }, 
          endTime: { type: String }    
        }
      ]
    }
  ],

  // Optional learner profile fields.
  gender: { type: String },
  age: { type: Number },

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
