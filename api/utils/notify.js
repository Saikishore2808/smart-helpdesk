// api/utils/notify.js
import Notification from "../models/Notification.js";

/**
 * Send a notification to a user
 * @param {String} type - e.g. "ticket"
 * @param {String} message - the message content
 * @param {String} userId - MongoDB ObjectId of the user to notify
 */
export async function sendNotification(type, message, userId) {
  try {
    const notif = await Notification.create({
      type,
      message,
      user: userId,
    });

    console.log(`📢 Notify ${userId}: [${type}] ${message}`);
    return notif;
  } catch (err) {
    console.error("❌ Notification failed:", err.message);
  }
}
