const Booking = require('../models/bookingModel');

const getTodayIST = () => {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
};

const getCurrentTimeIST = () => {
  return new Date().toLocaleTimeString('en-GB', { 
    timeZone: 'Asia/Kolkata', 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const autoCleanupBookings = async (filter) => {
  const today = getTodayIST();
  const now = getCurrentTimeIST();

  await Booking.updateMany(
    { ...filter, day: { $lt: today }, status: 'paid' },
    { $set: { status: 'completed' } }
  );
  await Booking.updateMany(
    { ...filter, day: { $lt: today }, status: { $in: ['accepted', 'pending'] } },
    { $set: { status: 'incomplete' } }
  );

  await Booking.updateMany(
    { ...filter, day: today, "slot.endTime": { $lt: now }, status: 'paid' },
    { $set: { status: 'completed' } }
  );
  await Booking.updateMany(
    { ...filter, day: today, "slot.endTime": { $lt: now }, status: { $in: ['accepted', 'pending'] } },
    { $set: { status: 'incomplete' } }
  );
};

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

// 2. എക്സ്‌പെർട്ടിന് വന്ന ബുക്കിംഗുകൾ
const getExpertBookingsController = async (req, res) => {
  try {
    const { expertId } = req.body;
    
    await autoCleanupBookings({ expertId });

    const bookings = await Booking.find({ expertId })
      .populate('userId', 'name email image age gender specialization'); 
      
    res.status(200).send({ success: true, data: bookings });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error fetching bookings", error });
  }
};

// 3. യൂസറുടെ ആക്ടീവ് ബുക്കിംഗുകൾ (ചാറ്റ് ലിസ്റ്റിന് വേണ്ടി)
const getUserActiveBookingsController = async (req, res) => {
  try {
    const { userId } = req.body;
    const today = getTodayIST();
    const now = getCurrentTimeIST();

    await autoCleanupBookings({ userId });
    
    const bookings = await Booking.find({
      userId,
      status: { $in: ['accepted', 'paid'] } 
    }).populate('expertId', 'name image specialization');

    const bookingsWithActiveStatus = bookings.map(b => {
      const isToday = b.day === today;
      const isWithinTime = now >= b.slot.startTime && now <= b.slot.endTime;
      return {
        ...b.toObject(),
        isVideoActive: b.status === 'paid' && isToday && isWithinTime
      };
    });

    res.status(200).send({ success: true, bookings: bookingsWithActiveStatus });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error fetching active bookings", error });
  }
};

// 4. സ്റ്റാറ്റസ് മാറ്റാൻ (Accept / Reject)
const updateStatusController = async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    if (status === 'accepted') {
      const currentBooking = await Booking.findById(bookingId);
      const slotTaken = await Booking.findOne({
        expertId: currentBooking.expertId,
        day: currentBooking.day,
        "slot.startTime": currentBooking.slot.startTime,
        status: { $in: ['accepted', 'paid'] } 
      });
      if (slotTaken) return res.status(200).send({ success: false, message: "Slot already taken!" });
    }
    const booking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true });
    res.status(200).send({ success: true, message: `Booking ${status}`, data: booking });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error updating status", error });
  }
};

// 5. പെയ്‌മെന്റ് അപ്‌ഡേറ്റ് ചെയ്യാൻ
const updatePaymentStatusController = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findByIdAndUpdate(bookingId, { status: 'paid' }, { new: true });
    res.status(200).send({ success: true, message: "Payment Successful!", data: booking });
  } catch (error) {
    res.status(500).send({ success: false, message: "Payment update failed", error });
  }
};

// 6. സിംഗിൾ ബുക്കിംഗ് സ്റ്റാറ്റസ് ചെക്ക് 
const checkBookingStatusController = async (req, res) => {
  try {
    const { userId, expertId } = req.body;
    const today = getTodayIST();
    const activeBookings = await Booking.find({
      userId, expertId,
      status: { $in: ['pending', 'accepted', 'paid'] }
    });
    res.status(200).send({ success: true, bookings: activeBookings });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error checking status", error });
  }
};

const cancelBookingController = async (req, res) => {
  try {
    const { userId, expertId } = req.body;
    await Booking.findOneAndDelete({ userId, expertId, status: 'pending' });
    res.status(200).send({ success: true, message: "Request Cancelled" });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error cancelling", error });
  }
};

const getExpertChatUsersController = async (req, res) => {
  try {
    const { expertId } = req.body;
    const today = getTodayIST();
    const now = getCurrentTimeIST();

    await autoCleanupBookings({ expertId });

    const bookings = await Booking.find({
      expertId,
      status: 'paid'
    }).populate('userId', 'name image specialization'); 

    const bookingsWithActiveStatus = bookings.map(b => {
      const isToday = b.day === today;
      const isWithinTime = now >= b.slot.startTime && now <= b.slot.endTime;
      return {
        ...b.toObject(),
        isVideoActive: isToday && isWithinTime
      };
    });

    res.status(200).send({ success: true, bookings: bookingsWithActiveStatus });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error fetching chat users", error });
  }
};

const getBookingByIdController = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId).populate('expertId userId');
    if (!booking) {
      return res.status(200).send({ success: false, message: "Booking not found" });
    }
    res.status(200).send({ success: true, booking });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error fetching booking", error });
  }
};

module.exports = { 
  bookExpertController, getExpertBookingsController, updateStatusController, 
  updatePaymentStatusController, checkBookingStatusController, 
  cancelBookingController, getUserActiveBookingsController, getExpertChatUsersController, getBookingByIdController
};