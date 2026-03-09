const multer = require('multer');

// Keep uploads in memory so files can be streamed directly to Cloudinary.
const storage = multer.memoryStorage();

const upload = multer({ 
    storage: storage,
    // Per-file safety limit (5 MB) to control memory usage and abuse.
    limits: { fileSize: 5 * 1024 * 1024 } 
});

// Reusable multer instance for routes handling multipart/form-data.
module.exports = upload;
