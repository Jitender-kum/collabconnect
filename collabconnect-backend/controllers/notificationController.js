import Notification from "../models/Notification.js";

// 1. Get My Notifications
export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 }); // Latest pehle dikhayenge
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 2. Mark All as Read
export const markRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, isRead: false }, 
      { isRead: true }
    );
    res.json({ message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};