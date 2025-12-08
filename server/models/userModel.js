const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'expert', 'admin'], 
    default: 'user',
  },
  image: {
    type: String, 
    default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
  },
  
  // Expert Specific Fields
  specialization: { type: String }, // e.g., Lawyer, Doctor
  experience: { type: Number }, // Years of experience
  fees: { type: Number }, // Per hour charge
  about: { type: String },
  isVerified: {
    type: Boolean,
    default: false, 
  },
  certificates: { type: String }, // URL of ID proof/Certificate

  // User Specific Fields
  gender: { type: String },
  age: { type: Number },

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);