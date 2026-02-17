const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');

const postReviewController = async (req, res) => {
  try {
    const { expertId, userId, bookingId, rating, message, userName } = req.body;

    const newReview = new Review({ expertId, userId, bookingId, rating, message, userName });
    await newReview.save();
    await Booking.findByIdAndUpdate(bookingId, { isReviewed: true });
    const expert = await User.findById(expertId);
    const currentNumReviews = expert.numReviews || 0;
    const currentAvgRating = expert.averageRating || 0;
    const totalReviews = currentNumReviews + 1;
    const newAverage = ((currentAvgRating * currentNumReviews) + rating) / totalReviews;
    await User.findByIdAndUpdate(expertId, {
      averageRating: newAverage,
      numReviews: totalReviews
    });

    res.status(200).send({ success: true, message: "Review posted successfully!" });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error in posting review", error });
  }
};

const getExpertReviewsController = async (req, res) => {
  try {
    const { expertId } = req.params;
    const reviews = await Review.find({ expertId }).sort({ createdAt: -1 });
    res.status(200).send({ success: true, data: reviews });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error fetching reviews", error });
  }
};

module.exports = { postReviewController, getExpertReviewsController };