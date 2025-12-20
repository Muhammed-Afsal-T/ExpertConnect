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
  certificates: { type: String }, // URL for Certificate
  idProof: { type: String },      // URL for ID Proof (പുതിയത്)
  
  // Availability (പുതിയത്)
  availableDays: { type: [String], default: [] }, 
  startTime: { type: String },
  endTime: { type: String },

  // User Specific Fields
  gender: { type: String },
  age: { type: Number },

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);