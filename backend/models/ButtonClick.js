const mongoose = require('mongoose');

const buttonClickSchema = new mongoose.Schema({
  button: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ButtonClick', buttonClickSchema);
