const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Notification = require('../models/notifications.model');

router.get('/notifications/:userid', async (req, res) => {
    try {
        const { userid } = req.params;

        const user = await User.findById(userid);
        if (!user) {
            return res.status(403).json({ message: "User not found!" });
        }

        const notifications = await Notification.find({ to: userid })
            .populate('from', 'username firstName lastName');

        res.status(200).json({ message: "Notifications fetched!", notifications });
    } catch (error) {
        res.status(500).json({ message: 'Fetching notifications failed!' });
    }
})

module.exports = router;