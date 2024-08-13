const express = require('express');
const { isAuthenticated, isDriver } = require('../middlewares/auth');
const router = require('./authRouter');
const gtestController = require('../controllers/gtestController');


router.get('/gtest', isAuthenticated, isDriver, (req, res) => {
    const { firstname, lastname, licenseno, age, cardetails ,comment,testResult} = req.session.user || {};

    // Check if all data are default
    if (firstname === 'default' && lastname === 'default' && licenseno === 'default') {
        res.render('gtest', { firstname: null, lastname: null, licenseno: null, age: null, cardetails: null, user: req.session.user });
    } else {
        res.render('gtest', { firstname, lastname, licenseno, age, cardetails,comment,testResult, user: req.session.user });
    }
});


// Handle POST request to fetch available slots for selected date
router.post('/gtest/slots', isAuthenticated, isDriver, gtestController.getAvailableSlots);

// Handle POST request to book a slot
router.post('/gtest/book', isAuthenticated, isDriver, gtestController.bookGSlot);

module.exports = router;