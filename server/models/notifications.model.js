const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notificationType: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

// notificationType; 1 = Add contact, 2 = Transaction, 3 = Request

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;