const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');
const Account = require('../models/account.model');

router.get('/admin-dashboard', async (req, res) => {
    try {
        const isadmin = req.headers['isadmin'];

        if (!isadmin)
            return res.status(401).json({ message: 'Unauthorized to access this page!' });

        const transactions = await Transaction.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                    totalTransactions: { $sum: 1 }
                }
            }
        ])

        const totalAccs = (await Account.find({})).length;

        const totalUsers = (await User.find({})).length;

        const totalTransactionAmount = transactions[0].totalAmount;
        const totalTranactions = transactions[0].totalTransactions

        res.status(200).json({
            stats: {
                totalAmount: totalTransactionAmount,
                totalTransactions: totalTranactions,
                totalAccounts: totalAccs,
                totalUsers: totalUsers
            },
            message: 'Admin Dashboard Data!'
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error!' })
    }
})

router.get('/admin-users', async (req, res) => {
    try {
        const isadmin = req.headers['isadmin'];

        if (!isadmin)
            return res.status(401).json({ message: 'Unauthorized to access this page!' });

        const users = await User.find({}, { username: 1, firstName: 1, lastName: 1, email: 1, isVerified: 1 });
        return res.status(200).json({ users, message: 'All users!' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error!' })
    }
})

module.exports = router;