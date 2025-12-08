const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Register User
const registerController = async (req, res) => {
  try {
    const { name, email, password, role, gender, age, specialization, experience, fees } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).send({ message: 'User already exists', success: false });
    }

    // 2. Hash Password (പാസ്‌വേഡ് സുരക്ഷിതമാക്കുന്നു)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create New User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role, // user or expert
      gender,
      age,
      specialization,
      experience,
      fees,
    });

    await newUser.save();
    res.status(201).send({ message: 'Register Successfully', success: true });

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Register Controller ${error.message}`, success: false });
  }
};

module.exports = { registerController };