const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Account = require('../models/account.model');
const Contact = require('../models/contact.model');
const Transaction = require('../models/transaction.model');
const Notification = require('../models/notifications.model');

router.post('/contacts', async (req, res) => {
    try {
        const { owner, name, email } = req.body;

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "User is not verified!" });
        }

        const contact = new Contact({
            name,
            email,
            owner
        });

        const notify = new Notification({
            from: owner,
            to: user._id,
            notificationType: 1
        })

        await notify.save();
        const savedContact = await contact.save();

        // await User.findByIdAndUpdate(
        //     userId,
        //     { $push: { contacts: savedContact._id } },
        //     { new: true }
        // );

        res.status(201).json({ savedContact, message: 'Contact added!' });
    } catch (error) {
        res.status(500).json({ message: 'Contact creation failed' });
    }
});

router.get('/contacts/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await Contact.find({ owner: userId })

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Contact retrieval failed' });
    }
});

router.get('/contacts/:search', async (req, res) => {
    try {
        const { search } = req.params;

        const regex = new RegExp(search, 'i');

        const contacts = await Contact.find({
            $or: [
                { firstName: regex },
                { lastName: regex },
                { email: regex }
            ]
        });

        res.status(200).json({ contacts });
    } catch (error) {
        res.status(500).json({ message: 'Contact retrieval failed' });
    }
})

router.get('/contact-email/:email', async (req, res) => {
    try {
        const { email } = req.params;

        const user = await Contact.find({ email })

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Contact retrieval failed' });
    }
});

router.get('/dashboard/:id', async (req, res) => {

    const id = req.params.id;

    const user = await User.findOne({ _id: id })

    if (!user) {
        return res.status(401).json({ message: 'User not found!' });
    }

    const accounts = await Account.find({ user: id });
    const transactions = await Transaction.find({});
    const contacts = await Contact.find({ owner: id });
    let total1 = 0, total2 = 0, transactionsCount = 0;

    transactions.forEach((t) => {
        if (accounts.some((acc) => acc._id.equals(t.fromAccount))) {
            total1 += t.amount;
            transactionsCount += 1;
        }
        if (accounts.some((acc) => acc._id.equals(t.toAccount))) {
            total2 += t.amount;
            transactionsCount += 1;
        }
    });

    const dashboardObj = {
        totalAccounts: accounts?.length,
        totalTransfers: transactionsCount,
        sentAmount: total1,
        receivedAmount: total2,
        contacts: contacts
    }

    res.status(200).json({ obj: dashboardObj })

})

module.exports = router;