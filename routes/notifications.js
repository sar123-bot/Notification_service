// routes/notifications.js
const express = require('express');
const router = express.Router();
const notificationQueue = require('../config/queue');
const Notification = require('../models/Notification');

// POST /notifications
router.post('/', async (req, res) => {
  const { userId, type, message } = req.body;

  if (!userId || !type || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  await notificationQueue.add(
  { userId, type, message },
  {
    attempts: 5, // Retry up to 5 times
    backoff: {
      type: 'exponential', // Use exponential backoff
      delay: 5000 // Initial delay 5 seconds
    }
  }
);
 // push to queue
  res.status(200).json({ message: 'Notification queued successfully' });
});

// GET /users/:id/notifications
// Add GET /users/:id/notifications
router.get('/users/:id/notifications', async (req, res) => {
  try {
    const userId = req.params.id;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
