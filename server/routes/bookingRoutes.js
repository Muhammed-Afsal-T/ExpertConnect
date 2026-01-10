const express = require('express');
const { 
    bookExpertController, 
    checkBookingStatusController, 
    cancelBookingController,
    getExpertBookingsController,
    updateStatusController
} = require('../controllers/bookingController');

const router = express.Router();

router.post('/book-expert', bookExpertController);
router.post('/check-status', checkBookingStatusController); 
router.post('/cancel-booking', cancelBookingController);
router.post('/get-expert-bookings', getExpertBookingsController);
router.post('/update-status', updateStatusController);

module.exports = router;