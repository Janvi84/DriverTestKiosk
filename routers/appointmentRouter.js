// routes/appointmentRouter.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAuthenticated, isAdmin } = require('../middlewares/auth');
const appointmentController = require('../controllers/appointmentController');

// GET /appointment - Render appointment page 
router.get('/', isAuthenticated, isAdmin, appointmentController.getAppointments);

// POST /add - for adding appointments 
router.post('/add', isAuthenticated, isAdmin, appointmentController.addAppointment);

// GET /appointment/slots - Get appointment slots for a specific date
router.get('/slots', isAuthenticated, isAdmin, appointmentController.getSlots);


// GET /appointment/drivers - Fetch driver details
router.get('/drivers', isAuthenticated, isAdmin, appointmentController.getDriverDetails);

module.exports = router;
