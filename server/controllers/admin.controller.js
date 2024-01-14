const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

router.get('/admin-users', async (req, res) => {
    try {
        const isadmin = req.headers['isadmin'];

        if (!isadmin)
            return res.status(401).json({ message: 'Unauthorized to access this page!' });

        const users = await User.find({}, { username: 1, firstName: 1, lastName: 1, email: 1 });
        return res.status(200).json({ users, message: 'All users!' });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error!' })
    }
})

module.exports = router;