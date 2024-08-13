const mongoose = require('mongoose');
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs');

const g2TestSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    licenseno: { type: String, required: true },
    age: { type: Number, required: true },
    cardetails: {
        make: { type: String, required: true },
        model: { type: String, required: true },
        year: { type: Number, required: true },
        platno: { type: String, required: true }
    }
    });

//hashing license number before saving
g2TestSchema.pre('save', async function(next) {
    if (this.isModified('licenseno') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.licenseno = await bcrypt.hash(this.licenseno, salt);
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});


    const G2test = mongoose.model('G2test',g2TestSchema);
    module.exports = G2test;