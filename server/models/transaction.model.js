const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    fromAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    toAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now() },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
