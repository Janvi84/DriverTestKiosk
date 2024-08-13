const express = require('express');
const g2testController = require('../controllers/g2testController');
const { isAuthenticated, isDriver } = require('../middlewares/auth');

const router = express.Router();

// Route to render the G2 Test page
router.get('/g2test', isAuthenticated, isDriver, (req, res) => {
    const user = req.session.user;
    
    // Log the user object
    console.log('User in route:', user);
    // Check if license number is default
    if (user.licenseno === 'default') {
        res.render('g2test', { user: null }); // Render form to collect data
    } else {
        res.render('g2test', { user }); // Render with user data
    }
});

// Route to handle form submission for G2 test
router.post('/submit', isAuthenticated, isDriver, g2testController.submitForm);

// Handle POST request to fetch available slots for selected date
router.post('/g2test/slots', isAuthenticated, isDriver, g2testController.getAvailableSlots);

// Handle POST request to book a slot
router.post('/g2test/book', isAuthenticated, isDriver, g2testController.bookSlot);


router.get('/g2test/results', isAuthenticated, isDriver, g2testController.displayTestResultsAsJSON);

module.exports = router;
