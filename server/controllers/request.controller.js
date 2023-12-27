const express = require('express');
const router = express.Router();
const Request = require('../models/request.model');
const Contact = require('../models/contact.model');
const Account = require('../models/account.model');
const User = require('../models/user.model');
const Notification = require('../models/notifications.model');

router.post('/request', async (req, res) => {
    try {
        const { account, contact, amount } = req.body;

        const yourAccount = await Account.findById(account);

        if (!yourAccount) {
            return res.status(403).json({ message: "Account not found!" });
        }

        const requestContact = await Contact.findById(contact);

        if (!requestContact) {
            return res.status(403).json({ message: "Contact not found!" });
        }

        const notify = new Notification({
            from: yourAccount._id,
            to: requestContact._id,
            notificationType: 3
        })

        const newRequest = new Request({
            account: account,
            contact: contact,
            amount: amount
        })

        await notify.save();
        await newRequest.save();

        res.status(200).json({ message: 'Money request sent!' });
    } catch (error) {
        res.status(500).json({ message: 'Money request failed!' });
    }
})

router.get('/requests/:userid', async (req, res) => {
    const { userid } = req.params;
    try {
        const user = await User.findById(userid);

        if (!user) {
            return res.status(403).json({ message: "User not found!" });
        }

        const userAccounts = Account.find({ user: userid });

        if (!userAccounts) {
            return res.status(403).json({ message: "No accounts associated with the user!" })
        }

        res.status(200).json({ message: "Accounts found associated with the user!", userAccounts });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch requests!' });
    }
})