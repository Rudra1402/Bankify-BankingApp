const express = require('express');
const router = express.Router();
// const authMiddleware = require('../middleware/auth');
const creditCardType = require('credit-card-type');
const Account = require('../models/account.model');
const User = require('../models/user.model');

router.post('/addaccount', async (req, res) => {
    try {

        const { accountNumber, accountType, userId } = req.body;

        const existingAccount = await Account.findOne({ accountNumber });
        if (existingAccount) {
            return res.status(400).json({ success: false, message: 'Account number is already in use' });
        }

        const account = new Account({
            accountNumber,
            accountType,
            user: userId,
        });

        await account.save();

        res.json({ success: true, message: 'Account created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Account creation failed' });
    }
});

router.get('/accounts/:id', async (req, res) => {
    const { id } = req.params;

    const user = await User.find({ _id: id })
    if (!user) {
        return res.status(400).json({ success: false, message: 'No such user exists!' });
    }

    const userAccounts = await Account.find({ user: id })

    res.json({ success: true, message: 'User accounts!', accounts: userAccounts })
})

router.get('/account-email/:email', async (req, res) => {
    const { email } = req.params;

    const user = await User.findOne({ email })
    if (!user) {
        return res.status(400).json({ success: false, message: 'No such user exists!' });
    }

    const userAccounts = await Account.find({ user: user._id })

    res.json({ success: true, message: 'User accounts!', accounts: userAccounts })
})

router.get('/balance/:userId', async (req, res) => {
    try {

        const { userId } = req.params;

        const accounts = await Account.find({ user: userId });
        if (!accounts) {
            return res.status(400).json({ success: false, message: 'No accounts exist!' });
        }

        let total = 0;
        accounts.map((account) => {
            total += account.balance;
        });

        res.status(200).json({ balance: total });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching account balances' });
    }
});

router.delete('/delete-account/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const account = await Account.findByIdAndDelete(id);

        if (!account) {
            return res.status(404).json({ message: 'Account not found!' });
        }

        res.status(200).json({ message: 'Account deleted!' });
    } catch (error) {
        res.status(500).json({ message: 'Account deletion failed!' });
    }
});

router.post('/validatecard', (req, res) => {
    const { cardNumber } = req.body;

    const cardInfo = creditCardType(cardNumber);

    if (cardInfo.length > 0) {
        res.json({ cardType: cardInfo[0].niceType, message: 'Card verified!' });
    } else {
        res.json({ cardType: 'Unknown', message: 'Card added as Unknown!' });
    }
});

module.exports = router;
