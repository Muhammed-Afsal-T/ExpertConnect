const User = require('../models/userModel');

// 1. Get All Experts (Verfied & Not Verified)
const getAllExpertsController = async (req, res) => {
  try {
    // role = 'expert' ആയ എല്ലാവരെയും വിളിക്കുന്നു
    const experts = await User.find({ role: 'expert' });
    
    res.status(200).send({
      success: true,
      message: 'Experts Data Fetched Successfully',
      data: experts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error while fetching experts',
      error,
    });
  }
};

// 2. Verify Expert (Account status മാറ്റാൻ)
const changeAccountStatusController = async (req, res) => {
  try {
    const { expertId, status } = req.body;
    
    // Expert-നെ കണ്ടുപിടിച്ച് isVerified മാറ്റുന്നു
    // status എന്നത് 'approved' ആണെങ്കിൽ isVerified = true ആക്കും
    const expert = await User.findById(expertId);
    expert.isVerified = (status === 'approved');
    await expert.save();

    res.status(200).send({
      success: true,
      message: 'Expert Status Updated Successfully',
      data: expert,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in Account Status',
      error,
    });
  }
};

module.exports = { getAllExpertsController, changeAccountStatusController };