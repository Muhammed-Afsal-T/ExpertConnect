const cron = require('node-cron');
const Booking = require('../models/bookingModel');
const { sendStartEmail, sendEndEmail } = require('./emailService');

const initCronJobs = () => {
    // Run every minute
    cron.schedule('* * * * *', async () => {
        try {
            const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
            const now = new Date().toLocaleTimeString('en-GB', {
                timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit'
            });

            // 1. Email users starting sessions (Start Time == Now)
            const startingSessions = await Booking.find({
                day: today,
                "slot.startTime": now,
                status: 'paid'
            }).populate('userId expertId');

            startingSessions.forEach(session => {
                sendStartEmail(session.userId.email, session.userId.name, session.expertId.name, session.slot.startTime);
                sendStartEmail(session.expertId.email, session.expertId.name, session.userId.name, session.slot.startTime);
            });

            // 2. Email users ending sessions (End Time == Now)
            const endingSessions = await Booking.find({
                day: today,
                "slot.endTime": now,
                status: 'paid'
            }).populate('userId expertId');

            endingSessions.forEach(session => {
                sendEndEmail(session.userId.email, session.userId.name, session.expertId.name);
            });

        } catch (error) {
            console.error("Cron Job Error:", error);
        }
    });

    console.log("Cron Job initialized");
};

module.exports = initCronJobs;
