const Notification = require("../models/Notification");
const queue = require("../config/queue");

exports.sendNotification = async (req, res) => {
  const { userId, type, content } = req.body;
  const notif = new Notification({ userId, type, content });
  await notif.save();

  await queue.add("send", { notificationId: notif._id });
  res.json({ message: "Notification queued" });
};

exports.getUserNotifications = async (req, res) => {
  const notifs = await Notification.find({ userId: req.params.id });
  res.json(notifs);
};
