/**
 * Resume Model
 * 
 * MongoDB schema for parsed resume documents.
 * 
 * @module models/Resume
 */

const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    // Personal Information
    name: {
        type: String,
        required: true,
        trim: true,
        default: 'Unknown',
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        default: null,
    },
    phone: {
        type: String,
        trim: true,
        default: null,
    },
    linkedin: {
        type: String,
        trim: true,
        default: null,
    },
    github: {
        type: String,
        trim: true,
        default: null,
    },
    website: {
        type: String,
        trim: true,
        default: null,
    },
    location: {
        type: String,
        trim: true,
        default: null,
    },

    // Professional Content
    skills: {
        type: [String],
        default: [],
    },
    experience: {
        type: [String],
        default: [],
    },
    education: {
        type: [String],
        default: [],
    },
    certifications: {
        type: [String],
        default: [],
    },
    projects: {
        type: [String],
        default: [],
    },
    summary: {
        type: String,
        default: '',
    },

    // Raw Data
    rawText: {
        type: String,
        default: '',
        maxlength: 50000, // Limit to ~50KB
    },
    fileName: {
        type: String,
        default: 'unknown',
    },
    fileSize: {
        type: Number,
        default: 0,
    },
    fileType: {
        type: String,
        enum: ['pdf', 'doc', 'docx', 'unknown'],
        default: 'unknown',
    },

    // Parsing Metadata
    parseMethod: {
        type: String,
        enum: ['ai', 'regex', 'demo', 'hybrid'],
        default: 'regex',
    },
    accuracy: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    processingTime: {
        type: Number,
        default: 0, // in milliseconds
    },

    // ATS Analysis (cached)
    atsScore: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
    },
    atsAnalyzedAt: {
        type: Date,
        default: null,
    },

    // User/Session tracking
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    sessionId: {
        type: String,
        default: null,
    },
    ipAddress: {
        type: String,
        default: null,
    },

    // Timestamps
    uploadDate: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt
});

// Indexes for performance
resumeSchema.index({ uploadDate: -1 });
resumeSchema.index({ email: 1 });
resumeSchema.index({ userId: 1 });
resumeSchema.index({ parseMethod: 1 });
resumeSchema.index({ 'skills': 1 });

// Virtual for formatted date
resumeSchema.virtual('formattedDate').get(function () {
    return this.uploadDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
});

// Instance method to get summary stats
resumeSchema.methods.getStats = function () {
    return {
        skillCount: this.skills.length,
        experienceCount: this.experience.length,
        educationCount: this.education.length,
        accuracy: this.accuracy,
        parseMethod: this.parseMethod,
    };
};

// Static method to find recent resumes
resumeSchema.statics.findRecent = function (limit = 10) {
    return this.find()
        .sort({ uploadDate: -1 })
        .limit(limit)
        .select('-rawText'); // Exclude raw text for performance
};

// Static method to search by skills
resumeSchema.statics.findBySkills = function (skills, limit = 20) {
    return this.find({ skills: { $in: skills } })
        .sort({ accuracy: -1 })
        .limit(limit)
        .select('-rawText');
};

// Pre-save hook to normalize email
resumeSchema.pre('save', function (next) {
    if (this.email) {
        this.email = this.email.toLowerCase().trim();
    }
    next();
});

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
