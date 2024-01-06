const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    pending: { type: Boolean, default: true },
    isReqAccepted: { type: Boolean, default: null },
    date: { type: Date, default: Date.now() }
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;