/**
 * User Model
 * 
 * MongoDB schema for user accounts and API key management.
 * 
 * @module models/User
 */

const mongoose = require('mongoose');

/**
 * Generate a random API key
 * @returns {string} New API key with prefix
 */
function generateApiKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'rp_'; // resume-parser prefix
    for (let i = 0; i < 32; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

const userSchema = new mongoose.Schema({
    // User Information
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    name: {
        type: String,
        trim: true,
        default: '',
    },

    // API Key
    apiKey: {
        type: String,
        unique: true,
        default: generateApiKey,
    },
    apiKeyCreatedAt: {
        type: Date,
        default: Date.now,
    },

    // Usage Tracking
    requestCount: {
        type: Number,
        default: 0,
    },
    lastRequestAt: {
        type: Date,
        default: null,
    },
    resumesParsed: {
        type: Number,
        default: 0,
    },

    // Plan/Tier (for future use)
    tier: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free',
    },
    monthlyLimit: {
        type: Number,
        default: 100, // Free tier default
    },
    monthlyUsage: {
        type: Number,
        default: 0,
    },
    usageResetAt: {
        type: Date,
        default: () => {
            const now = new Date();
            return new Date(now.getFullYear(), now.getMonth() + 1, 1);
        },
    },

    // Account Status
    isActive: {
        type: Boolean,
        default: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },

    // Metadata
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastLogin: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ apiKey: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for whether user is within usage limit
userSchema.virtual('isWithinLimit').get(function () {
    return this.monthlyUsage < this.monthlyLimit;
});

// Instance method to regenerate API key
userSchema.methods.regenerateApiKey = function () {
    this.apiKey = generateApiKey();
    this.apiKeyCreatedAt = new Date();
    return this.apiKey;
};

// Instance method to increment usage
userSchema.methods.incrementUsage = async function () {
    // Check if we need to reset monthly usage
    if (new Date() >= this.usageResetAt) {
        this.monthlyUsage = 0;
        const now = new Date();
        this.usageResetAt = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    this.requestCount++;
    this.monthlyUsage++;
    this.lastRequestAt = new Date();
    await this.save();
};

// Instance method to increment resumes parsed
userSchema.methods.incrementResumesParsed = async function () {
    this.resumesParsed++;
    await this.incrementUsage();
};

// Static method to find user by API key
userSchema.statics.findByApiKey = function (apiKey) {
    return this.findOne({ apiKey, isActive: true });
};

// Static method to find or create user by email
userSchema.statics.findOrCreate = async function (email, name = '') {
    let user = await this.findOne({ email: email.toLowerCase() });

    if (!user) {
        user = await this.create({
            email: email.toLowerCase(),
            name,
        });
    }

    return user;
};

// Pre-save hook to ensure email is lowercase
userSchema.pre('save', function (next) {
    if (this.email) {
        this.email = this.email.toLowerCase().trim();
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
module.exports.generateApiKey = generateApiKey;
