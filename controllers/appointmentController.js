// controllers/appointmentController.js
const Appointment = require('../models/Appointment');
const swal = require('sweetalert');
const User = require('../models/User');

// To render appointment page
const getAppointments = (req, res) => {
    try {
        const { success } = req.query; // Get success parameter from query
        res.render('appointment', { user: req.session.user, success }); // Pass success to the appointment view
    } catch (error) {
        console.error('Error rendering appointment page:', error);
        res.status(500).send('Internal Server Error');
    }
};

// To add Appointment
const addAppointment = async (req, res) => {
    try {
        const { date, time } = req.body;
        const existingAppointment = await Appointment.findOne({ date, time });

        if (existingAppointment) {
            req.flash('error', 'This appointment slot is already taken.');
            return res.redirect('/appointment');
        }

        const newAppointment = new Appointment({ date, time });
        await newAppointment.save();

        req.flash('success', 'Appointment slot added successfully.');

        // Redirect with success message
        res.redirect('/appointment?success=true');

    } catch (err) {
        console.error(err);
        req.flash('error', 'An error occurred while adding the appointment slot.');
        res.redirect('/appointment');
    }
};

// To get slots for a given date
const getSlots = async (req, res) => {
    try {
        const { date } = req.query;
        const appointments = await Appointment.find({ date });
        const slots = appointments.map(appointment => appointment.time);
        res.json(slots);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving appointment slots.');
    }
};

// To get completed tests
const getCompletedTests = async (req, res) => {
    try {
        // Fetch users who have completed their tests
        const users = await User.find({ testResult: { $ne: null } }).exec();
        console.log('Users:', users); // Log the users to verify data
        res.render('appointment', { users }); // Pass users data to the view
    } catch (error) {
        console.error('Error fetching completed tests:', error);
        res.status(500).send('Internal Server Error');
    }
}

//To get the driverlist --- who completed test
const getDriverDetails = async (req, res) => {
    try {
        // Fetch all users with a non-null testResult
        const drivers = await User.find({ testResult: { $in: [true, false] } })
        .select('firstname lastname testType testResult') // Select only necessary fields
        .exec();

        // Check if any drivers were found
        if (drivers.length === 0) {
            return res.status(404).json({ message: 'No drivers with completed tests found' });
        }
        console.log(drivers, "drivers list")
        // Send driver details as JSON response
        res.json(drivers);
    } catch (error) {
        console.error('Error fetching driver details:', error);
        res.status(500).json({ message: 'Error fetching driver details' });
    }
};


module.exports = {
    getAppointments,
    addAppointment,
    getSlots,
    getCompletedTests,
    getDriverDetails
};
