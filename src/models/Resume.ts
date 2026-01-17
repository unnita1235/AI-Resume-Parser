// src/models/Resume.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IResume extends Document {
  userId?: string; // Optional if you add auth later
  fileName: string;
  originalText: string;
  structuredData: {
    name: string;
    email: string;
    phone: string;
    skills: string[];
    experience: any[];
    education: any[];
    summary: string;
  };
  createdAt: Date;
}

const ResumeSchema: Schema = new Schema({
  userId: { type: String, index: true },
  fileName: { type: String, required: true },
  originalText: { type: String, required: true },
  structuredData: {
    name: { type: String, default: "Unknown" },
    email: { type: String },
    phone: { type: String },
    skills: [String],
    experience: [Schema.Types.Mixed],
    education: [Schema.Types.Mixed],
    summary: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

// Prevent model recompilation error in Next.js
const Resume: Model<IResume> = mongoose.models.Resume || mongoose.model<IResume>('Resume', ResumeSchema);

export default Resume;
