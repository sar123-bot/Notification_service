const Notification = require("../models/Notification");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

exports.sendNotification = async (id) => {
  const notif = await Notification.findById(id);
  if (!notif) return;

  try {
    if (notif.type === "email") {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: "user@example.com", // hardcoded/test email
        subject: "Notification",
        text: notif.content,
      });
    } else if (notif.type === "sms") {
      await twilioClient.messages.create({
        body: notif.content,
        from: process.env.TWILIO_PHONE,
        to: "+11234567890", // test number
      });
    }

    notif.delivered = true;
    await notif.save();
  } catch (err) {
    console.error("Send failed:", err.message);
    throw err; // for retry
  }
};
