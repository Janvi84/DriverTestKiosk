const express = require('express');
const router = express.Router();
const { isAuthenticated, isExaminer } = require('../middlewares/auth');
const examinerController = require('../controllers/examinerController');



// Route to render the examiner page
router.get('/examiner', isAuthenticated, isExaminer, examinerController.getAppointmentsForExaminer);

// Route to update driver information
router.post('/update', examinerController.updateDriver);

// Route to get driver details
router.get('/driver/:driverId', examinerController.getDriverDetails);

module.exports = router;


