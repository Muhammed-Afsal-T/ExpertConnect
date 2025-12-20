const express = require('express');
const { 
    registerController, 
    loginController, 
    updateProfileController,
    getUserDataController
} = require('../controllers/userController');
const upload = require('../middlewares/multerMiddleware');

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/getUserData', getUserDataController);

router.post('/updateProfile', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'certificates', maxCount: 1 },
    { name: 'idProof', maxCount: 1 }
]), updateProfileController);

module.exports = router;