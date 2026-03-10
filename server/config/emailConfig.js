const nodemailer = require('nodemailer');

/**
 * Shared Nodemailer transporter configuration for ExpertConnect.
 * Using direct SMTP transport with SSL for better stability on cloud platforms like Render.
 */
const transporter = nodemailer.createTransport({
  // Gmail SMTP server host.
  host: 'smtp.gmail.com',
  // Port 465 is the standard for Secure SMTP (SSL).
  port: 465,
  // Set to true because we are using port 465.
  secure: true, 
  auth: {
    // Sender email address managed via environment variables for security.
    user: process.env.EMAIL_USER,
    // Unique Google App Password (never use your primary account password here).
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Export the transporter instance to be reused across the application
 * (e.g., in booking reminders and account updates).
 */
module.exports = transporter;