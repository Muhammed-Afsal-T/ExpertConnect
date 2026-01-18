const Message = require('../models/messageModel');

const sendMessageController = async (req, res) => {
    try {
        const { bookingId, sender, receiver, message } = req.body;

        const newMessage = new Message({
            bookingId,
            sender,
            receiver,
            message
        });

        await newMessage.save();

        res.status(201).send({
            success: true,
            message: "Message saved successfully",
            newMessage
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in sending message",
            error
        });
    }
};

const getMessagesController = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const messages = await Message.find({ bookingId }).sort({ createdAt: 1 });

        res.status(200).send({
            success: true,
            messages
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in fetching messages",
            error
        });
    }
};

module.exports = { sendMessageController, getMessagesController };