const cron = require('node-cron');
const Booking = require('../models/bookingModel');
const { sendStartEmail, sendEndEmail } = require('./emailService');

// Registers periodic scheduler tasks; call once during server bootstrap.
const initCronJobs = () => {
    // Run every minute
    cron.schedule('* * * * *', async () => {
        try {
            // Keep scheduler comparisons aligned with app booking timezone (IST).
            const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
            const now = new Date().toLocaleTimeString('en-GB', {
                timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit'
            });

            // Find paid sessions that start in the current minute.
            const startingSessions = await Booking.find({
                day: today,
                "slot.startTime": now,
                status: 'paid'
            }).populate('userId expertId');

            // Notify both participants to join right away.
            startingSessions.forEach(session => {
                sendStartEmail(session.userId.email, session.userId.name, session.expertId.name, session.slot.startTime);
                sendStartEmail(session.expertId.email, session.expertId.name, session.userId.name, session.slot.startTime);
            });

            // Find paid sessions that end in the current minute.
            const endingSessions = await Booking.find({
                day: today,
                "slot.endTime": now,
                status: 'paid'
            }).populate('userId expertId');

            // Ask users for post-session feedback once the session ends.
            endingSessions.forEach(session => {
                sendEndEmail(session.userId.email, session.userId.name, session.expertId.name);
            });

        } catch (error) {
            console.error("Cron Job Error:", error);
        }
    });
};

module.exports = initCronJobs;
