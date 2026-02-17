const transporter = require('../config/emailConfig');

// 1. Session start email
const sendStartEmail = async (userEmail, userName, expertName, slotTime) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Session Started - ExpertConnect',
    html: `<h3>Hello ${userName},</h3>
           <p>Your session with <b>${expertName}</b> has started (${slotTime}). Please join the chat and video call immediately.</p>
           <a href="${process.env.CLIENT_URL}/chat">Join Now</a>`
  };
  await transporter.sendMail(mailOptions);
};

// 2. Session end & rating email
const sendEndEmail = async (userEmail, userName, expertName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Session Ended - ExpertConnect',
    html: `<h3>Hello ${userName},</h3>
           <p>Your session with <b>${expertName}</b> has concluded. We hope it was helpful!</p>
           <p>Please take a moment to rate and review the expert on the platform.</p>
           <a href="${process.env.CLIENT_URL}/booking-history">Leave a Review</a>`
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendStartEmail, sendEndEmail };
