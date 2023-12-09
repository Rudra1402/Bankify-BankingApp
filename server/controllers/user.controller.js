require('dotenv').config()
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const nodeMailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const secretKey = process.env.SECRET_KEY;

const transporter = nodeMailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: 'bankingapp.ba5@gmail.com',
        pass: process.env.EMAIL_PASS
    }
})

const sendVerificationEmail = (user, verificationLink) => {
    const mailOptions = {
        from: 'bankingapp.ba5@gmail.com',
        to: user?.email,
        subject: 'Email Verification',
        html: `
            <div style="padding: 15px 10px 20px; background-color: lightCoral; border-radius: 6px; width: 100%;">
                <div style="font-size: 24px; text-align: center;">To make your transactions smooth, easy, and secure, please verify your email.</div>
                <br/>
                <div style="text-align:center;">
                <a href="${verificationLink}" target="_blank" style="border-radius: 4px; color: blue; padding: 6px 10px; text-decoration: none; background-color: lightGreen; margin: auto; font-size: 20px">Verify</a>
                </div>
            </div>
        `
    }

    transporter
        .sendMail(mailOptions)
        .then((info) => {
            console.log('Email sent:', info.response);
        })
        .catch((error) => {
            console.error('Error sending email:', error);
        });

}

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ username, email, password: hashedPassword });
        const verificationToken = uuidv4();
        user.verificationToken = verificationToken;
        await user.save();

        res.status(201).json({ message: 'User registered successfully. Please verify your email!' });
        sendVerificationEmail(user, `http://localhost:5173/verify/${verificationToken}`)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred during registration' });
    }
});

router.get('/verify/:token', async (req, res) => {
    const token = req.params.token;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
        return res.status(404).send('Verification token not found.');
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).send('Email verified successfully.');
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Email not found!' });
        }

        const checkPass = await bcrypt.compare(password, user.password);

        if (!checkPass) {
            return res.status(401).json({ message: 'Incorrect password!' });
        }

        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

        let loggedInUser = {
            id: user._id,
            token: token,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            isVerified: user.isVerified,
            profileImageUrl: user.profileImageUrl
        }

        res.status(200).json({ message: 'Login successful', user: loggedInUser });
    } catch (error) {
        res.status(500).json({ message: 'Login failed' });
    }
});

router.get('/user/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const user = await User.findOne({ _id: id })

        if (!user) {
            return res.status(401).json({ message: 'User not found!' });
        }

        res.json({
            user: {
                id: user?._id,
                firstName: user?.firstName,
                lastName: user?.lastName,
                email: user?.email,
                profileImageUrl: user?.profileImageUrl,
                username: user?.username
            },
        })
    } catch (error) {
        console.log(error?.message)
        res.json({ message: 'Some error occurred!' })
    }
})

router.put('/update/user', async (req, res) => {
    try {
        const { id, firstName, lastName, email, username } = req.body;

        const user = await User.findByIdAndUpdate(
            id,
            {
                firstName: firstName,
                lastName: lastName,
                email: email,
                username: username
            },
            { new: true }
        );

        if (!user) {
            return res.status(401).json({ message: 'User not found!' });
        }

        return res.status(200).json({ message: 'User updated successfully!' });
    } catch (error) {
        res.json({ message: 'User update failed' })
    }
})

router.put('/profileimage/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { url } = req.body;

        const user = await User.findOne({ _id: id })

        if (!user) {
            return res.status(401).json({ message: 'User not found!' });
        }

        user.profileImageUrl = url;

        await user.save();

        return res.json({ message: 'Url updated!' })
    } catch (error) {
        console.log(error?.message)
        res.json({ message: 'Some error occurred!' })
    }
})

router.put('/change-password', async (req, res) => {
    try {
        const { currentPassword, newPassword, id } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(401).json({ message: 'User not found!' });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while changing the password' });
    }
});

router.get('/protected', (req, res) => {
    res.json({ message: 'This is a protected route' });
});

router.post('/uploadImage', upload.single('image'), (req, res) => {
    const bucket = admin.storage().bucket();
    const file = req.file;
    console.log(file)

    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadPath = `uploads/${Date.now()}_${file.originalname}`;
    const blob = bucket.file(uploadPath);

    const blobStream = blob.createWriteStream({
        metadata: {
            contentType: file.mimetype,
        },
    });

    blobStream.on('error', (error) => {
        console.error('Error uploading file:', error);
        res.status(500).json({ message: 'File upload failed' });
    });

    blobStream.on('finish', () => {
        res.status(200).json({ message: 'File uploaded successfully' });
    });

    blobStream.end(file.buffer);
});

module.exports = router;
