const Appointment = require('../models/Appointment');
const User = require('../models/User');

const getAppointmentsForExaminer = async (req, res) => {
    try {
        const { testType } = req.query; // Retrieve the selected testType from query parameters

        // Fetch all appointments with bookedBy populated
        const appointments = await Appointment.find({})
            .populate('bookedBy', 'firstname lastname licenseno testType');

        // Filter appointments based on the testType of the users in bookedBy
        const filteredAppointments = appointments.filter(appointment => 
            appointment.bookedBy.some(driver => 
                !testType || driver.testType === testType
            )
        );

        // Pass the selectedTestType to the view along with the filtered appointments
        res.render('examiner', {
            appointments: filteredAppointments,
            selectedTestType: testType || '', // Default to an empty string if no filter is applied
            user: req.user // Assuming you have user information available in req.user
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).send('Error fetching appointments');
    }
};



// Controller function to update driver information
const updateDriver = async (req, res) => {
    try {
        const { driverId, comment, result } = req.body;

        console.log('Received data:', { driverId, comment, result });

        if (result !== 'pass' && result !== 'fail') {
            return res.status(400).send('Invalid result value');
        }

        const testResult = result === 'pass'; // Convert result to boolean

        console.log('Updating driver with ID:', driverId);

        const updateResult = await User.findByIdAndUpdate(driverId, { comment, testResult }, { new: true });

        console.log('Update result:', updateResult);

        if (!updateResult) {
            return res.status(404).send('Driver not found');
        }

        res.redirect('/examiner');
    } catch (error) {
        console.error('Error updating driver:', error);
        res.status(500).send('Error updating driver');
    }
};





// Controller function to get driver details
const getDriverDetails = async (req, res) => {
    try {
        const { driverId } = req.params;
        const driver = await User.findById(driverId).select('firstname lastname cardetails'); // Select only necessary fields

        if (!driver) {
            return res.status(404).send('Driver not found');
        }

        // Send driver details as JSON response
        res.json(driver);
        // console.log(driver,"driver details");
    } catch (error) {
        console.error('Error fetching driver details:', error);
        res.status(500).send('Error fetching driver details');
    }
};




module.exports = {
    getAppointmentsForExaminer,
    getDriverDetails,
    updateDriver
};


