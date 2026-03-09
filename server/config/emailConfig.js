const nodemailer = require('nodemailer');

// Shared Nodemailer transporter for sending transactional emails.
// Credentials must come from environment variables (never commit them to git).
const transporter = nodemailer.createTransport({
  // Uses Gmail SMTP preset; switch this if moving to another mail provider.
  service: 'gmail',
  auth: {
    // Sender account/email used by Nodemailer.
    user: process.env.EMAIL_USER,
    // App password or SMTP password for the sender account.
    pass: process.env.EMAIL_PASS
  }
});

// Export a single transporter instance so all modules use the same configuration.
module.exports = transporter;
