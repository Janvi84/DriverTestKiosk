const User = require('../models/User');
const Appointment = require('../models/Appointment');
const bcrypt = require('bcryptjs');


const submitForm = async (req, res) => {
    const { firstname, lastname, licenseno, age, cardetails } = req.body;

    // Validate input
    if (!firstname || !lastname || !licenseno || !age || !cardetails || !cardetails.make || !cardetails.model || !cardetails.year || !cardetails.platno) {
        console.error('Missing required fields:', {
            firstname,
            lastname,
            licenseno,
            age,
            cardetails
        });
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user is authenticated
    if (!req.session.user) {
        console.error('User not authenticated');
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        // Check for duplicate username
        const existingUser = await User.findOne({ username: req.session.user.username });
        if (existingUser && existingUser._id.toString() !== req.session.user.id) {
            console.error('Username already exists');
            return res.status(409).json({ error: 'Username already exists' });
        }

        // Generate salt and hash license number
        const salt = await bcrypt.genSalt(10);
        const hashedLicense = await bcrypt.hash(licenseno, salt);

        // Update user data with G2 test information
        const updatedUserData = {
            firstname,
            lastname,
            licenseno: hashedLicense, // Save hashed license number
            age,
            cardetails: {
                make: cardetails.make,
                model: cardetails.model,
                year: cardetails.year,
                platno: cardetails.platno
            }
        };

        // Retrieve and update user document
        const user = await User.findByIdAndUpdate(
            req.session.user.id, // Using user ID to identify the document
            updatedUserData,
            { new: true }
        );

        if (!user) {
            console.error(`User not found: ${req.session.user.username}`);
            return res.status(404).json({ error: 'User not found' });
        }

        // Redirect to dashboard page after successful submission
        req.flash('success_msg', 'Thank you for submitting the G2 test form!');
        return res.redirect('/logout');

    } catch (err) {
        console.error(`Error saving G2 test form data: ${err.message}`);
        console.error(err.stack);
        return res.status(500).json({ error: 'Error saving G2 test form data' });
    }
};


// Controller function to get available slots for selected date
const getAvailableSlots = async (req, res) => {
    try {
        const { appointmentDate } = req.body;

        // Fetch appointments for the selected date from the database
        const appointments = await Appointment.find({ date: appointmentDate });

         // Format the appointments into a JSON response
         const slots = appointments.map(appointment => ({
            _id: appointment._id,
            time: appointment.time,
            isTimeSlotAvailable: appointment.isTimeSlotAvailable
        }));

        // Send the JSON response
        res.json(slots);
    } catch (error) {
        console.error('Error fetching available slots:', error);
        res.status(500).send('Error fetching available slots.');
    }
};


// Controller function to book a slot
const bookSlot = async (req, res) => {
    try {
        console.log("Booking G2 Test Slot");

        const { appointmentDate, slotId } = req.body;
        const appointment = await Appointment.findById(slotId);

        if (!appointment) {
            return res.status(404).json({ error: 'Slot not found' });
        }

        if (!appointment.isTimeSlotAvailable) {
            return res.status(409).json({ error: 'Slot is not available' });
        }

        appointment.isTimeSlotAvailable = false;
        appointment.bookedBy.push(req.session.user.id);
        await appointment.save();

        const user = await User.findById(req.session.user.id);
        user.appointmentId = appointment._id;
        user.testType = 'G2';  // Ensure this is set to 'G2'
        await user.save();

        res.json({ success: true, message: 'Slot booked successfully' });
    } catch (error) {
        console.error('Error booking slot:', error);
        res.status(500).json({ error: 'Error booking slot' });
    }
};




// Function to return test results as JSON
const displayTestResultsAsJSON = async (req, res) => {
    try {
        const driver = await User.findById(req.session.user.id).select('testType testResult comment').exec();

        if (driver && driver.testResult !== null && driver.comment !== null) {
            res.json({
                success: true,
                testType: driver.testType,
                testResult: driver.testResult,
                comment: driver.comment,
            });
        } else {
            res.json({
                success: false,
                message: 'No data available for this user.',
            });
        }
    } catch (error) {
        console.error('Error fetching test results:', error);
        res.status(500).json({ error: 'Error fetching test results' });
    }
};



module.exports = {
    submitForm,
    getAvailableSlots,
    bookSlot,
    displayTestResultsAsJSON
   
    
};
