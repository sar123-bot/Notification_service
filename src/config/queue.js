// src/config/queue.js
const Queue = require("bull");

const notificationQueue = new Queue("notification-queue", process.env.REDIS_URL);

module.exports = notificationQueue;
