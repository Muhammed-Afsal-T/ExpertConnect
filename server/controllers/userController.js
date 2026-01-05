const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary');

// --- REGISTER USER ---
const registerController = async (req, res) => {
  try {
    const { name, email, password, role, gender, age } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).send({ message: 'User already exists', success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      gender,
      age,
    });

    await newUser.save();
    res.status(201).send({ message: 'Register Successfully', success: true });

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Register Controller Error`, success: false });
  }
};

// --- LOGIN USER ---
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).send({ message: 'User not found', success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).send({ message: 'Invalid Email or Password', success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "expertconnect123", {
      expiresIn: '1d',
    });

    const userData = user.toObject();
    delete userData.password;

    res.status(200).send({
      message: 'Login Successful',
      success: true,
      token,
      user: userData 
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Login Error`, success: false });
  }
};

// --- GET CURRENT USER DATA ---
const getUserDataController = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(200).send({ message: "User not found", success: false });
    }
    user.password = undefined;
    res.status(200).send({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Auth error", success: false, error });
  }
};

// --- UPDATE PROFILE (Updated with Gender) ---
const updateProfileController = async (req, res) => {
  try {
    const { 
      userId, name, age, gender, specialization, 
      experience, fees, about, availableDays, startTime, endTime 
    } = req.body;
    
    const updateData = { 
      name, age, gender, specialization, experience, fees, about, 
      startTime, endTime,
      availableDays: typeof availableDays === 'string' ? availableDays.split(',') : availableDays 
    };

    if (req.files) {
      const uploadToCloudinary = async (fileBuffer) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
            if (error) reject(error); else resolve(result.secure_url);
          }).end(fileBuffer);
        });
      };

      if (req.files['image']) updateData.image = await uploadToCloudinary(req.files['image'][0].buffer);
      if (req.files['certificates']) updateData.certificates = await uploadToCloudinary(req.files['certificates'][0].buffer);
      if (req.files['idProof']) updateData.idProof = await uploadToCloudinary(req.files['idProof'][0].buffer);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    res.status(200).send({
      success: true,
      message: 'Profile Updated Successfully',
      data: updatedUser,
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Error in updating profile', error });
  }
};

module.exports = { registerController, loginController, updateProfileController, getUserDataController };