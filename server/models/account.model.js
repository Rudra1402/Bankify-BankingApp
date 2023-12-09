const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    accountNumber: { type: String, required: true, unique: true },
    accountType: { type: String, required: true },
    balance: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
