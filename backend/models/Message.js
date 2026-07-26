const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  fromEmail: { type: String, required: true },
  toEmail: { type: String, required: true },
  message: { type: String, required: true },
  sendAt: { type: Date, required: true },
  sent: { type: Boolean, default: false },
  sentAt: { type: Date },
  lastError: { type: String },
  attempts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
