const mongoose = require('mongoose');


const visitorSchema = new mongoose.Schema({
    ip: String,
    country: String,
    city: String,
    region: String,
    isp: String,
    timezone: String,
    visitedAt: { type: Date, default: Date.now } // Automatically saves date & time
});

const Visitor = mongoose.model('Visitor', visitorSchema);