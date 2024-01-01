const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    contactUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now() }
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;