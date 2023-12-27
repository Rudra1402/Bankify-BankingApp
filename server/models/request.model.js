const mongoose = require('mongoose');

const requestSchema = new mongoose.model({
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now() }
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;