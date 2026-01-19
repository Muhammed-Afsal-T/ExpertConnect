const express = require('express');
const { 
    registerController, 
    loginController, 
    updateProfileController,
    getUserDataController,
    getAllExpertsController,forgotPasswordController,
    resetPasswordController
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
router.get('/getAllExperts', getAllExpertsController);
router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password/:id/:token', resetPasswordController);

module.exports = router;