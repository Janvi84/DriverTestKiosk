const User = require('../models/User');

// Middleware to check if the username already exists
const checkDuplicateUsername = async (req, res, next) => {
    const { username } = req.body;

    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            req.flash('error_msg', 'Username already exists. Please choose a different username.');
            return res.redirect('/login'); // Redirect to signup page with error message
        }

        next(); // Move to the next middleware
    } catch (err) {
        console.error('Error checking username duplication:', err);
        req.flash('error_msg', 'Error checking username duplication');
        res.redirect('/signup'); // Redirect to signup page with error message
    }
};

module.exports = {
    checkDuplicateUsername
};
