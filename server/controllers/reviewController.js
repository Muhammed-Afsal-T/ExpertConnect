const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');

const postReviewController = async (req, res) => {
  try {
    const { expertId, userId, bookingId, rating, message, userName } = req.body;

    // Persist review entry tied to the completed booking and participants.
    const newReview = new Review({ expertId, userId, bookingId, rating, message, userName });
    await newReview.save();
    // Mark booking as reviewed to prevent duplicate review submissions from UI flow.
    await Booking.findByIdAndUpdate(bookingId, { isReviewed: true });

    // Recompute expert aggregates incrementally to avoid scanning all reviews each time.
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
    // Newest-first sorting keeps recent feedback visible at the top.
    const reviews = await Review.find({ expertId }).sort({ createdAt: -1 });
    res.status(200).send({ success: true, data: reviews });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error fetching reviews", error });
  }
};

module.exports = { postReviewController, getExpertReviewsController };
