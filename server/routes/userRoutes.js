const express = require('express');
const { registerController, loginController, updateProfileController } = require('../controllers/userController');
const upload = require('../middlewares/multerMiddleware'); 

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);

// UPDATE PROFILE || POST
// ഒരേ സമയം ഒന്നിലധികം ഫയലുകൾ (image, certificates) എടുക്കാൻ .fields ഉപയോഗിക്കുന്നു
router.post('/updateProfile', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'certificates', maxCount: 1 }
]), updateProfileController);

module.exports = router;