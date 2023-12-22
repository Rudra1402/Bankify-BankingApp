const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: "" },
    accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    isAdmin: { type: Boolean, default: false },
    passResetToken: { type: String }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
