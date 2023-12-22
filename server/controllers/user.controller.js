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
            <div style="font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #333;">Welcome to Bankify, ${user?.username}!</h1>
                </div>
                <div style="margin-bottom: 20px; color: #555;">
                    <p>To make your transactions smooth, easy, and secure, please verify your email.</p>
                    <p>Enjoy your banking!</p>
                </div>
                <div style="text-align: center;">
                    <a href=${verificationLink} style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;" 
                    target="_blank">Verify Email</a>
                </div>
                <div style="text-align: center; color: #777; font-size: 12px;">
                    <p>This email was sent by Bankify. If you did not sign up for an account, please ignore this email.</p>
                </div>
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

const sendPasswordResetEmail = (user, resetLink) => {
    const mailOptions = {
        from: 'bankingapp.ba5@gmail.com',
        to: user?.email,
        subject: 'Password Reset Link',
        html: `
            <div style="font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #333;">Hello, ${user?.username}!</h1>
                </div>
                <div style="margin-bottom: 20px; color: #555;">
                    <p>Click on the link below to reset your password!</p>
                </div>
                <div style="text-align: center;">
                    <a href=${resetLink} style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;" 
                    target="_blank">Reset Password</a>
                </div>
                <div style="text-align: center; color: #777; font-size: 12px;">
                    <p>This email was sent by Bankify. If you did not sign up for an account, please ignore this email.</p>
                </div>
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
        sendVerificationEmail(user, `https://bankify-app.netlify.app/verify/${verificationToken}`)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred during registration' });
    }
});

router.get('/verify/:token', async (req, res) => {
    const token = req.params.token;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
        return res.status(404).json({ message: 'Verification token not found.' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully.' });
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

        const findUser = await User.findById(id);

        if (!findUser) {
            return res.status(401).json({ message: 'User not found!' });
        }

        let isEmailUpdatedFlag = false;
        if (findUser.email != email)
            isEmailUpdatedFlag = true;

        let updateObject = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            username: username
        }

        if (isEmailUpdatedFlag) {
            const verificationToken = uuidv4();
            updateObject = {
                ...updateObject,
                verificationToken: verificationToken,
                isVerified: false
            }
            sendVerificationEmail(updateObject, `https://bankify-app.netlify.app/verify/${verificationToken}`);
        }

        await User.findByIdAndUpdate(
            id,
            updateObject,
            { new: true }
        );

        return res.status(200).json({
            message: 'User updated successfully!',
            isEmailUpdated: isEmailUpdatedFlag
        });
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

router.get('/forgot-password', async (req, res) => {
    try {
        const { email } = req.query;

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(403).json({ message: "Email not found!" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "Please verify your email first!" });
        }

        const passResetToken = uuidv4();
        user.passResetToken = passResetToken;
        await user.save();

        sendPasswordResetEmail(user, `https://bankify-app.netlify.app/reset-password/${passResetToken}`);

        res.json({ message: 'Password reset link sent successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending password reset link!' });
    }
});

router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const user = await User.findOne({ passResetToken: token });

        if (!user) {
            return res.status(403).json({ message: "User not found based on token!" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        user.passResetToken = null;
        user.save();

        res.json({ message: 'Password reset successfully.' });
    } catch (error) {
        res.status(403).json({ message: 'Invalid token.' });
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
