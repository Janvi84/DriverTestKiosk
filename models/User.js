const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ['Driver', 'Examiner', 'Admin'], default: 'Driver' },
    testType: { type: String, enum: ['G2', 'G'], default: null }, 
    firstname: { type: String, default: 'default' },
    lastname: { type: String, default: 'default' },
    licenseno: { type: String, default: 'default' },
    age: { type: Number, default: 0 },
    cardetails: {
        make: { type: String, default: 'default' },
        model: { type: String, default: 'default' },
        year: { type: Number, default: 0 },
        platno: { type: String, default: 'default' }
    },
    appointmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    comment: { type: String, default: '' },
    testResult: { type: Boolean, default: null }
});

// Encrypt licenseno before saving
userSchema.pre('save', async function(next) {
    try {
        if (this.isModified('licenseno')) {
            const hashedLicense = await bcrypt.hash(this.licenseno, 10);
            this.licenseno = hashedLicense;
        }
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('User', userSchema);
