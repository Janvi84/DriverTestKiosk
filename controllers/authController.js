const User = require('../models/User');
const bcrypt = require('bcryptjs');

const getLogin = (req, res) => {
    res.render('login', { messages: req.flash() });
};

const postSignup = async (req, res) => {
    const { username, password, userType } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Encrypt password
        const newUser = new User({
            username,
            password: hashedPassword,
            userType
        });

        await newUser.save();
        req.flash('success_msg', 'Signup successful! Please log in.');
        res.redirect('/login'); // Redirect to login page after signup
    } catch (err) {
        // console.error('Error signing up:', err);
        req.flash('error_msg', 'Error signing up');
        res.redirect('/signup'); // Redirect to signup page with error message
    }
};

const postLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            req.flash('error_msg', 'User not found');
            return res.redirect('/login');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            req.flash('error_msg', 'Invalid password');
            return res.redirect('/login');
        }

        // Set session user data
        req.session.user = {
            id: user._id,
            username: user.username,
            userType: user.userType,
            firstname: user.firstname,
            lastname: user.lastname,
            licenseno: user.licenseno,
            age: user.age,
            cardetails: user.cardetails
        };

        // Check if this is the first-time login
        if (user.firstname === 'default' && user.lastname === 'default' && user.licenseno === 'default') {
            req.flash('success_msg', 'First-time login detected. Please update your information.');
        } else {
            req.flash('success_msg', 'Login successful.');
        }

        // Redirect to dashboard after login
        res.redirect('/index');
    } catch (err) {
        console.error('Error logging in:', err);
        req.flash('error_msg', 'Error logging in');
        res.redirect('/login'); // Redirect to login page with error message
    }
};

// Logout function
const getLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.redirect('/'); // Redirect to home page if error occurs
        } else {
            res.redirect('/login'); // Redirect to login page after successful logout
        }
    });
};

module.exports = {
    getLogin,
    postSignup,
    postLogin,
    getLogout
};
