const express = require('express');
const { getAllExpertsController, changeAccountStatusController } = require('../controllers/adminController');

const router = express.Router();

// GET ALL EXPERTS || GET
router.get('/getAllExperts', getAllExpertsController);

// ACCOUNT STATUS CHANGE || POST
router.post('/changeStatus', changeAccountStatusController);

module.exports = router;