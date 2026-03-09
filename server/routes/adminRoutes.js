const express = require('express');
const { getAllExpertsController, changeAccountStatusController } = require('../controllers/adminController');

const router = express.Router();

// Admin list view for expert verification queue and history.
router.get('/getAllExperts', getAllExpertsController);

// Approve/reject expert verification status.
router.post('/changeStatus', changeAccountStatusController);

module.exports = router;
