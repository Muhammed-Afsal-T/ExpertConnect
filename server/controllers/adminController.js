const User = require('../models/userModel');

// 1. Get All Experts (Verfied & Not Verified)

const getAllExpertsController = async (req, res) => {
  try {
    // Basic pagination controls from query string.
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Show unverified experts first, then newest accounts in each group.
    const experts = await User.find({ role: 'expert' })
      .sort({ isVerified: 1, createdAt: -1 }) 
      .skip(skip)
      .limit(limit);

    // Used to calculate total pages for client-side pagination UI.
    const totalExperts = await User.countDocuments({ role: 'expert' });

    res.status(200).send({
      success: true,
      message: 'Experts Data Fetched Successfully',
      data: experts,
      totalPages: Math.ceil(totalExperts / limit),
      currentPage: page
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

// 2. Verify Expert (Account status )
const changeAccountStatusController = async (req, res) => {
  try {
    const { expertId, status } = req.body;
    
    // Map admin action string to persisted boolean flag.
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
