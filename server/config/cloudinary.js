const cloudinary = require('cloudinary').v2;

// Configure Cloudinary once at startup using environment variables.
// Keep secrets in `.env` and never hardcode credentials in source files.
cloudinary.config({
  // Cloud account identifier (visible/public, but still managed via env for consistency).
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // API key used to identify the application making requests.
  api_key: process.env.CLOUDINARY_API_KEY,
  // API secret used to sign authenticated upload/delete requests.
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Export the configured SDK instance so all services/controllers reuse the same setup.
module.exports = cloudinary;
