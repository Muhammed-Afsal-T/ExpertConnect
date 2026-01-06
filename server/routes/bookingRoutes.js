const express = require('express');
const { 
    bookExpertController, 
    checkBookingStatusController, 
    cancelBookingController 
} = require('../controllers/bookingController');

const router = express.Router();

router.post('/book-expert', bookExpertController);
router.post('/check-status', checkBookingStatusController); 
router.post('/cancel-booking', cancelBookingController); 

module.exports = router;