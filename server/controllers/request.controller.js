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

        const requestContact = await Contact.findOne({ email: contact });

        if (!requestContact) {
            return res.status(403).json({ message: "Contact not found!" });
        }

        const contactUser = await User.findOne({ email: contact });

        const notify = new Notification({
            from: yourAccount.user,
            to: contactUser._id,
            notificationType: 3
        })

        const newRequest = new Request({
            account: yourAccount._id,
            fromUser: yourAccount.user,
            toUser: contactUser._id,
            amount: amount
        })

        await notify.save();
        await newRequest.save();

        res.status(200).json({ message: 'Money request sent!' });
    } catch (error) {
        res.status(500).json({ message: 'Money request failed!' });
    }
})

router.get('/requests/incoming/:userid', async (req, res) => {
    const { userid } = req.params;
    try {
        const user = await User.findById(userid);

        if (!user) {
            return res.status(403).json({ message: "User not found!" });
        }

        const contact = await Contact.findOne({ owner: userid });

        if (!contact) {
            return res.status(403).json({ message: 'Contact owner not found!' });
        }

        const userRequests = await Request.find({ toUser: userid })
            .sort({ date: -1 })
            .populate({
                path: 'account',
                model: 'Account',
                populate: {
                    path: 'user',
                    model: 'User',
                    select: 'username firstName lastName',
                }
            });

        res.status(200).json({
            message: "Requests associated with the user!",
            userRequests
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch requests!' });
    }
})

router.get('/requests/outgoing/:userid', async (req, res) => {
    const { userid } = req.params;
    try {
        const user = await User.findById(userid);

        if (!user) {
            return res.status(403).json({ message: "User not found!" });
        }

        const contact = await Contact.findOne({ owner: userid });

        if (!contact) {
            return res.status(403).json({ message: 'Contact owner not found!' });
        }

        const userRequests = await Request.find({ fromUser: userid })
            .sort({ date: -1 })
            .populate({
                path: 'toUser',
                model: 'User',
                select: 'username firstName lastName'
            });

        res.status(200).json({
            message: "Requests associated with the user!",
            userRequests
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch requests!' });
    }
})

module.exports = router;