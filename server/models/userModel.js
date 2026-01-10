const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'expert', 'admin'], default: 'user' },
  image: { type: String, default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg' },
  
  // Expert Specific Fields
  specialization: { type: String },
  experience: { type: Number },
  fees: { type: Number },
  about: { type: String },
  isVerified: { type: Boolean, default: false },
  certificates: { type: String }, 
  idProof: { type: String },      
  
  // Ratings Logic 
  averageRating: { type: Number, default: 0 }, 
  numReviews: { type: Number, default: 0 },

  // --- PRO SLOT SYSTEM ---
  availability: [
    {
      date: { type: String }, // Format: "YYYY-MM-DD"
      slots: [
        {
          startTime: { type: String }, // e.g., "10:00 AM"
          endTime: { type: String }    // e.g., "11:00 AM"
        }
      ]
    }
  ],

  // User Specific Fields
  gender: { type: String },
  age: { type: Number },

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);