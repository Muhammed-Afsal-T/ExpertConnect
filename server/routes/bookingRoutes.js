const express = require('express');
const { 
    bookExpertController, checkBookingStatusController, cancelBookingController,
    getExpertBookingsController, updateStatusController, 
    updatePaymentStatusController, getUserActiveBookingsController, getExpertChatUsersController,
    getBookingByIdController, getUserBookingHistoryController, reportExpertController, getAllReportsController
} = require('../controllers/bookingController');

const router = express.Router();

// Booking creation and request lifecycle actions.
router.post('/book-expert', bookExpertController);
router.post('/check-status', checkBookingStatusController); 
router.post('/cancel-booking', cancelBookingController);

// Expert-side booking management and status transitions.
router.post('/get-expert-bookings', getExpertBookingsController);
router.post('/update-status', updateStatusController);
router.post('/update-payment-status', updatePaymentStatusController);

// Session access helpers for active consultations/chat.
router.post('/get-user-active-bookings', getUserActiveBookingsController);
router.post('/get-expert-chat-users', getExpertChatUsersController);

// History/reporting endpoints.
router.get('/get-booking-by-id/:bookingId', getBookingByIdController);
router.get('/user-history/:userId', getUserBookingHistoryController);
router.post('/report-expert', reportExpertController);
router.get('/get-all-reports', getAllReportsController);

module.exports = router;
