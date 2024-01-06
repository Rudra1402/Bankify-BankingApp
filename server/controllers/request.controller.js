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
            contact: requestContact._id,
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

router.put('/request-decline/:reqid', async (req, res) => {
    try {
        const { reqid } = req.params;

        const request = await Request.findById(reqid);

        if (!request) {
            return res.status(403).json({ message: "Request not found!" });
        }

        request.pending = false;
        request.isReqAccepted = false;
        request.save();

        res.status(200).json({ message: "Request declined successfully!" })
    } catch (error) {
        res.status(500).json({ message: 'Failed to decline the request!' });
    }
})

router.put('/request-initiate/:reqid', async (req, res) => {
    try {
        const { reqid } = req.params;
        const { fromAccount, toAccount, amount } = req.body;

        const request = await Request.findById(reqid);

        if (!request) {
            return res.status(403).json({ message: "Request not found!" });
        }

        const body = {
            fromAccount,
            toAccount,
            amount
        };

        const postTransaction = await fetch('http://localhost:8000/api/transfer', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await postTransaction.json();
        if (postTransaction.status != 200) {
            return res.status(400).json({ message: data?.message })
        }

        request.pending = false;
        request.isReqAccepted = true;
        request.save();

        res.status(200).json({ message: "Request accepted successfully!" })
    } catch (error) {
        res.status(500).json({ message: 'Failed to initiate the request!' });
    }
})

module.exports = router;