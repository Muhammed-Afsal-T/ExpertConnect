const express = require('express');
const router = express.Router();
const { postReviewController, getExpertReviewsController } = require('../controllers/reviewController');

router.post('/post-review', postReviewController);
router.get('/get-reviews/:expertId', getExpertReviewsController);

module.exports = router;