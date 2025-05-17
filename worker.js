require('dotenv').config();

const mongoose = require('mongoose');
const notificationQueue = require('./config/queue');
const Notification = require('./models/Notification');
const sendSms = require('./utils/sendSMS'); // Your Twilio SMS sender

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected (worker)');
}).catch(err => {
  console.error('MongoDB connection error (worker):', err);
});

// Process jobs from the queue
notificationQueue.process(async (job) => {
  try {
    const { userId, type, message } = job.data;

    const notification = new Notification({
      userId,
      type,
      message,
      createdAt: new Date(),
      delivered: false,
      error: null,
    });

    // Save notification initially (pending delivery)
    await notification.save();

    // Send SMS if type is 'sms'
    if (type === 'sms') {
      await sendSms(userId, message); // You may need user phone number, adjust accordingly
    }

    // If other types like email or in-app, handle here (email sending or skip)

    // Mark notification as delivered
    notification.delivered = true;
    notification.error = null;
    await notification.save();

    console.log(`Notification sent and saved for userId: ${userId}`);

    return Promise.resolve();
  } catch (error) {
    console.error('Error processing notification job:', error);

    // Update notification with error info
    if (error.jobId) {
      const failedJob = await Notification.findOne({ _id: error.jobId });
      if (failedJob) {
        failedJob.error = error.message;
        failedJob.delivered = false;
        await failedJob.save();
      }
    }

    return Promise.reject(error);
  }
});

// Event listener for job failures, logs the error
notificationQueue.on('failed', (job, err) => {
  console.error(`❌ Job failed for userId ${job.data.userId}. Reason:`, err.message);
});
