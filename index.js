const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const authRouter = require('./routers/authRouter');
const g2testRouter = require('./routers/g2testRouter');
const gtestRouter = require('./routers/gtestRouter');
const appointmentRouter = require('./routers/appointmentRouter');
const { isAuthenticated, isDriver, isExaminer,isAdmin } = require('./middlewares/auth');
const examinerRouter = require('./routers/examinerRouter');


const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware setup
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key_here',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());


// MongoDB connection
require('dotenv').config();

const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error('MongoDB uyt connection error:', err));

app.get('/', (req, res) => res.render('dashboard'));
app.get('/dashboard', (req, res) => res.render('dashboard'));
app.get('/index', isAuthenticated, (req, res) => res.render('index', { user: req.session.user }));


// Routes

app.use('/', examinerRouter);
app.use('/', authRouter); // Authentication routes
app.use('/', g2testRouter); // G2 test routes
app.use('/', gtestRouter); // G test routes
app.use('/appointment', isAuthenticated, isAdmin, appointmentRouter); // Appointment routes

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


// Pass flash messages to views
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




