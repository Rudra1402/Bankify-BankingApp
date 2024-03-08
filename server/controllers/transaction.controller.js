const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction.model');
const Account = require('../models/account.model');
const Notification = require('../models/notifications.model');
const User = require('../models/user.model');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const puppeteer = require('puppeteer');

router.post('/transfer', async (req, res) => {
    try {
        const { fromAccount, toAccount, amount } = req.body;

        const sourceAccount = await Account.findById(fromAccount);
        const destinationAccount = await Account.findById(toAccount);

        if (!sourceAccount || !destinationAccount) {
            return res.status(403).json({ success: false, message: 'One or both accounts not found!' });
        }

        if (sourceAccount.balance < amount) {
            return res.status(400).json({ success: false, message: 'Insufficient balance!' });
        }

        const transaction = new Transaction({
            fromAccount: sourceAccount._id,
            toAccount: destinationAccount._id,
            amount,
        });

        sourceAccount.balance -= amount;
        destinationAccount.balance += amount;

        const notify = new Notification({
            from: sourceAccount.user,
            to: destinationAccount.user,
            notificationType: 2
        });

        await notify.save();
        await transaction.save();
        await sourceAccount.save();
        await destinationAccount.save();

        res.status(200).json({
            success: true,
            message: 'Funds updated successfully!',
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Transfer failed' });
    }
});

router.post('/stripe-checkout-session', async (req, res) => {
    const { amount } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Bankify Transfer',
                    },
                    unit_amount: amount * 100,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'http://localhost:5173/dashboard/transfers',
            cancel_url: 'http://localhost:5173/dashboard/transfers',
        });

        res.json({ id: session.id, message: 'Stripe Success!' })
    } catch (err) {
        console.error('Error processing payment:', err);
        let message = 'An error occurred while processing your payment.';

        if (err?.type === 'StripeCardError') {
            message = err.message;
        }

        res.status(500).json({ message });
    }
});

router.get('/history/:accountId', async (req, res) => {
    try {
        const accountId = req.params.accountId;

        const transactionHistory = await Transaction.find({
            $or: [{ fromAccount: accountId }, { toAccount: accountId }],
        }).populate({
            path: 'fromAccount toAccount',
            populate: {
                path: 'user',
                model: 'User',
                select: 'username email firstName profileImageUrl'
            },
        });

        res.status(200).json({ transactionHistory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching transaction history' });
    }
});

router.get('/transaction/:userid', async (req, res) => {
    try {
        const { userid } = req.params;

        const user = await User.findById(userid);
        if (!user) {
            return res.status(401).json({ message: 'User not found!' });
        }

        const accounts = await Account.find({ user: userid });
        let history = [];

        await Promise.all(accounts.map(async (acc) => {
            const accountId = acc._id;
            const accountNumber = acc.accountNumber;

            const transactionHistory = await Transaction.find({
                $or: [{ fromAccount: accountId }, { toAccount: accountId }],
            }).populate({
                path: 'fromAccount toAccount',
                populate: {
                    path: 'user',
                    model: 'User',
                    select: 'username email firstName lastName profileImageUrl'
                },
            });

            history.push([accountNumber, transactionHistory]);
        }));

        res.json({ history });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching transaction history' });
    }
});

router.get('/generate-pdf', async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({ width: 1200, height: 800 });
    await page.goto('http://localhost:5173/dashboard');

    const dialogId = "statement_container";
    // await page.waitForSelector(`#${dialogId}`);

    const pdfPath = 'D:/statement.pdf';

    await page.pdf({ path: pdfPath, format: 'A4', clip: { selector: `#${dialogId}` } });
    await browser.close();

    return res.sendFile(pdfPath);
})

module.exports = router;
