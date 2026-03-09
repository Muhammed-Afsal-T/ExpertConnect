const transporter = require('../config/emailConfig');

// Session start reminder sent when a paid slot reaches its start time.
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

// Session completion email that nudges users to leave feedback.
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

// Booking acceptance notification with payment/join CTA.
const sendAcceptEmail = async (userEmail, userName, expertName, date, slot) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Booking Request Accepted - ExpertConnect',
    html: `<h3>Hello ${userName},</h3>
           <p>Great news! Your booking request with <b>${expertName}</b> has been <b>Accepted</b>.</p>
           <p><b>Booking Details:</b><br>
           Date: ${date}<br>
           Slot: ${slot}</p>
           <p>Please complete the payment to join the session. Once paid, you can chat with the expert.</p>
           <a href="${process.env.CLIENT_URL}/chat">Pay Now & Join Chat</a>` 
  };
  await transporter.sendMail(mailOptions);
};

// Booking rejection notification including optional expert reason.
const sendRejectEmail = async (userEmail, userName, expertName, date, slot, reason) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Booking Request Update - ExpertConnect',
    html: `<h3>Hello ${userName},</h3>
           <p>We regret to inform you that your booking request with <b>${expertName}</b> for <b>${date} (${slot})</b> has been <b>Rejected</b>.</p>
           <p><b>Reason from Expert:</b><br>
           <i>"${reason}"</i></p>
           <p>You can try booking another slot or another expert on our platform.</p>
           <a href="${process.env.CLIENT_URL}/user-dashboard">Find Another Expert</a>`
  };
  await transporter.sendMail(mailOptions);
};

// Shared mail helpers used by booking and scheduler workflows.
module.exports = { sendStartEmail, sendEndEmail, sendAcceptEmail, sendRejectEmail };
