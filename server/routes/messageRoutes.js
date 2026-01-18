const express = require('express');
const { sendMessageController, getMessagesController } = require('../controllers/messageController');

const router = express.Router();

router.post('/send-message', sendMessageController);

router.get('/get-messages/:bookingId', getMessagesController);

module.exports = router;