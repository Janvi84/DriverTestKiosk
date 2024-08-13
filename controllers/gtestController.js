const User = require('../models/User');
const Appointment = require('../models/Appointment');
const bcrypt = require('bcryptjs');

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
const bookGSlot = async (req, res) => {
    try {
        console.log("Booking G Test Slot");

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
        user.testType = 'G';  // Ensure this is set to 'G'
        await user.save();

        res.json({ success: true, message: 'Slot booked successfully' });
    } catch (error) {
        console.error('Error booking slot:', error);
        res.status(500).json({ error: 'Error booking slot' });
    }
};

module.exports = {
    getAvailableSlots,
    bookGSlot,
};
