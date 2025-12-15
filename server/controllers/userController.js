const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Token ഉണ്ടാക്കാൻ


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


// LOGIN USER
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).send({ message: 'User not found', success: false });
    }

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).send({ message: 'Invalid Email or Password', success: false });
    }

    // 3. Generate Token (യൂസറെ തിരിച്ചറിയാനുള്ള രഹസ്യ കോഡ്)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "expertconnect123", {
      expiresIn: '1d',
    });

    // 4. Send Response
    res.status(200).send({
      message: 'Login Successful',
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in LoginController: ${error.message}`, success: false });
  }
};

module.exports = { registerController, loginController };