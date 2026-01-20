const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary');
const transporter = require('../config/emailConfig');

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const getTodayIST = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
const getCurrentTimeIST = () => new Date().toLocaleTimeString('en-GB', { 
    timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit' 
});

// --- REGISTER USER ---
const registerController = async (req, res) => {
  try {
    const { name, email, password, role, gender, age } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).send({ message: 'User already exists', success: false });
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      name, email, password: hashedPassword, role, gender, age,
    });
    await newUser.save();
    res.status(201).send({ message: 'Register Successfully', success: true });
  } catch (error) {
    res.status(500).send({ message: `Register Error`, success: false });
  }
};

// --- LOGIN USER ---
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(200).send({ message: 'User not found', success: false });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(200).send({ message: 'Invalid Credentials', success: false });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "expertconnect123", { expiresIn: '1d' });
    const userData = user.toObject();
    delete userData.password;
    res.status(200).send({ message: 'Login Successful', success: true, token, user: userData });
  } catch (error) {
    res.status(500).send({ message: `Login Error`, success: false });
  }
};

// --- UPDATE PROFILE ---
const updateProfileController = async (req, res) => {
  try {
    const { userId, name, age, gender, specialization, experience, fees, about, availability } = req.body;
    const updateData = { name, age, gender, specialization, experience, fees, about };

    if (availability) {
      const parsedAvailability = typeof availability === 'string' ? JSON.parse(availability) : availability;
      const today = getTodayIST();
      const now = getCurrentTimeIST();

      updateData.availability = parsedAvailability.filter(dayObj => {
        if (dayObj.date > today) return true;
        if (dayObj.date === today) {
          dayObj.slots = dayObj.slots.filter(slot => slot.endTime > now);
          return dayObj.slots.length > 0;
        }
        return false;
      });
    }

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
    res.status(200).send({ success: true, message: 'Profile Updated!', data: updatedUser });
  } catch (error) {
    res.status(500).send({ success: false, message: 'Update Error', error });
  }
};

const getUserDataController = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(200).send({ message: "User not found", success: false });

    const today = getTodayIST();
    const now = getCurrentTimeIST();

    if (user.role === 'expert' && user.availability && user.availability.length > 0) {
      const initialLength = user.availability.length;
      
      user.availability = user.availability.filter(dayObj => {
        if (dayObj.date > today) return true;
        if (dayObj.date === today) {
          dayObj.slots = dayObj.slots.filter(slot => slot.endTime > now);
          return dayObj.slots.length > 0;
        }
        return false;
      });

      if (JSON.stringify(user.availability).length !== JSON.stringify(user.toObject().availability).length) {
        await user.save();
      }
    }

    user.password = undefined;
    res.status(200).send({ success: true, data: user });
  } catch (error) {
    res.status(500).send({ success: false, message: "Auth error", error });
  }
};

// --- GET ALL VERIFIED EXPERTS ---
const getAllExpertsController = async (req, res) => {
  try {
    const experts = await User.find({ role: 'expert', isVerified: true });
    const today = getTodayIST();
    const now = getCurrentTimeIST();

    const filteredExperts = experts.map(expert => {
      if (expert.availability) {
        expert.availability = expert.availability.filter(dayObj => {
          if (dayObj.date > today) return true;
          if (dayObj.date === today) {
            const validSlots = dayObj.slots.filter(slot => slot.endTime > now);
            dayObj.slots = validSlots;
            return validSlots.length > 0;
          }
          return false;
        });
      }
      return expert;
    });

    res.status(200).send({ success: true, data: filteredExperts });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error fetching experts", error });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(200).send({ success: false, message: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "expertconnect123", { expiresIn: '15m' });
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${user._id}/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset - ExpertConnect',
      html: `<p>You requested a password reset. Click the link below to set a new password. This link expires in 15 minutes.</p>
             <a href="${resetLink}">${resetLink}</a>`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send({ success: true, message: "Reset link sent to your email" });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error in forgot password", error });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    jwt.verify(token, process.env.JWT_SECRET || "expertconnect123", async (err, decode) => {
      if (err) return res.status(401).send({ success: false, message: "Invalid or expired token" });
      const hashedPassword = await hashPassword(password);
      await User.findByIdAndUpdate(id, { password: hashedPassword });
      res.status(200).send({ success: true, message: "Password updated successfully" });
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Reset password failed", error });
  }
};

module.exports = { registerController, loginController, updateProfileController, getUserDataController, getAllExpertsController, forgotPasswordController, resetPasswordController};