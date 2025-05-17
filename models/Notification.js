const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: Number,
  type: String, // email, sms, in-app
  content: String,
  delivered: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  error: { type: String, default: null }, 
});

module.exports = mongoose.model("Notification", notificationSchema);

