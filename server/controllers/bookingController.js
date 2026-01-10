const Booking = require('../models/bookingModel');

// 1. റിക്വസ്റ്റ് അയക്കാൻ
const bookExpertController = async (req, res) => {
  try {
    const { userId, expertId, day, slot, amount } = req.body;
    const existingBooking = await Booking.findOne({ 
      userId, expertId, day, "slot.startTime": slot.startTime, status: 'pending' 
    });
    if (existingBooking) {
      return res.status(200).send({ success: false, message: "Already requested for this slot." });
    }
    const newBooking = new Booking({ userId, expertId, day, slot, amount });
    await newBooking.save();
    res.status(201).send({ success: true, message: "Booking Request Sent!", data: newBooking });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error in booking", error });
  }
};

// 2. എക്സ്‌പെർട്ടിന് വന്ന എല്ലാ ബുക്കിംഗുകളും എടുക്കാൻ
const getExpertBookingsController = async (req, res) => {
  try {
    const { expertId } = req.body;
    const bookings = await Booking.find({ expertId }).populate('userId', 'name image'); 
    res.status(200).send({ success: true, data: bookings });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error fetching bookings", error });
  }
};

// 3. സ്റ്റാറ്റസ് മാറ്റാൻ (Accept / Reject)
const updateStatusController = async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    
    // അക്സെപ്റ്റ് ചെയ്യാൻ ശ്രമിക്കുമ്പോൾ ആ സ്ലോട്ട് ഫ്രീയാണോ എന്ന് നോക്കുന്നു
    if (status === 'accepted') {
      const currentBooking = await Booking.findById(bookingId);
      const slotTaken = await Booking.findOne({
        expertId: currentBooking.expertId,
        day: currentBooking.day,
        "slot.startTime": currentBooking.slot.startTime,
        status: 'accepted'
      });
      
      if (slotTaken) {
        return res.status(200).send({ 
          success: false, 
          message: "You have already accepted another request for this slot!" 
        });
      }
    }

    const booking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true });
    res.status(200).send({ success: true, message: `Booking ${status}`, data: booking });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error updating status", error });
  }
};

// 4. സ്റ്റാറ്റസ് ചെക്ക് ചെയ്യാൻ
const checkBookingStatusController = async (req, res) => {
  try {
    const { userId, expertId } = req.body;
    const booking = await Booking.findOne({ userId, expertId, status: 'pending' });
    res.status(200).send({ success: true, isPending: !!booking, data: booking });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error checking status", error });
  }
};

// 5. ക്യാൻസൽ ചെയ്യാൻ
const cancelBookingController = async (req, res) => {
  try {
    const { userId, expertId } = req.body;
    await Booking.findOneAndDelete({ userId, expertId, status: 'pending' });
    res.status(200).send({ success: true, message: "Request Cancelled" });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error cancelling", error });
  }
};

module.exports = { 
  bookExpertController, getExpertBookingsController, 
  updateStatusController, checkBookingStatusController, cancelBookingController 
};