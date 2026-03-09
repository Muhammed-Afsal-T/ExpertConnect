const express = require('express');
const { sendMessageController, getMessagesController } = require('../controllers/messageController');

const router = express.Router();

// Persist a chat message for a booking conversation.
router.post('/send-message', sendMessageController);

// Fetch full message history for a booking thread.
router.get('/get-messages/:bookingId', getMessagesController);

module.exports = router;
