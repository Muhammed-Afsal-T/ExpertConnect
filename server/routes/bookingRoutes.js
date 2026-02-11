const express = require('express');
const { 
    bookExpertController, checkBookingStatusController, cancelBookingController,
    getExpertBookingsController, updateStatusController, 
    updatePaymentStatusController, getUserActiveBookingsController, getExpertChatUsersController,
    getBookingByIdController
} = require('../controllers/bookingController');

const router = express.Router();

router.post('/book-expert', bookExpertController);
router.post('/check-status', checkBookingStatusController); 
router.post('/cancel-booking', cancelBookingController);
router.post('/get-expert-bookings', getExpertBookingsController);
router.post('/update-status', updateStatusController);
router.post('/update-payment-status', updatePaymentStatusController);
router.post('/get-user-active-bookings', getUserActiveBookingsController);
router.post('/get-expert-chat-users', getExpertChatUsersController);
router.get('/get-booking-by-id/:bookingId', getBookingByIdController);

module.exports = router;