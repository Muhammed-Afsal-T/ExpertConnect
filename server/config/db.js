const mongoose = require('mongoose');

// Establish MongoDB connection before starting the API server.
// Keep `MONGO_URI` in environment variables so credentials stay out of source control.
const connectDB = async () => {
  try {
    // Create and cache the default mongoose connection for the app lifecycle.
    const conn = await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    // Connection is mandatory; exit so the app doesn't run in a broken state.
    console.log(`Error: ${error.message}`);
    process.exit(1); // Stop server if connection fails
  }
};

// Export startup helper to be called from the main server entrypoint.
module.exports = connectDB;
