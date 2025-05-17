// src/utils/sendSms.js
const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

async function sendSms(to, message) {
  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: to // must be a valid phone number with country code (e.g., +91xxxxxxxxxx)
    });
    console.log(`SMS sent to ${to}: SID ${response.sid}`);
    return true;
  } catch (error) {
    console.error(`SMS failed to ${to}:`, error.message);
    return false;
  }
}

module.exports = sendSms;
