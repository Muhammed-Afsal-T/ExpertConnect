const Booking = require('../models/bookingModel');

const bookExpertController = async (req, res) => {
  try {
    const { userId, expertId, day, amount } = req.body;

    const existingBooking = await Booking.findOne({ userId, expertId, day, status: 'pending' });
    if (existingBooking) {
      return res.status(200).send({
        success: false,
        message: "You have already sent a request for this day.",
      });
    }

    const newBooking = new Booking({ userId, expertId, day, amount });
    await newBooking.save();
    res.status(201).send({
      success: true,
      message: "Booking Request Sent Successfully!",
      data: newBooking
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error while booking", error });
  }
};

const checkBookingStatusController = async (req, res) => {
  try {
    const { userId, expertId } = req.body;
    const booking = await Booking.findOne({ userId, expertId, status: 'pending' });
    
    if (booking) {
      res.status(200).send({ success: true, isPending: true, data: booking });
    } else {
      res.status(200).send({ success: true, isPending: false });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: "Error checking status", error });
  }
};

const cancelBookingController = async (req, res) => {
  try {
    const { userId, expertId } = req.body;
    await Booking.findOneAndDelete({ userId, expertId, status: 'pending' });
    res.status(200).send({ success: true, message: "Request Cancelled Successfully" });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error cancelling booking", error });
  }
};

module.exports = { bookExpertController, checkBookingStatusController, cancelBookingController };