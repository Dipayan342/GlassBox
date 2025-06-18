// models/CV.js
const mongoose = require('mongoose');

const WorkExperienceSchema = new mongoose.Schema({
  title: { type: String },
  company: { type: String },
  location: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  description: { type: String },
});

const EducationSchema = new mongoose.Schema({
  degree: { type: String },
  major: { type: String },
  university: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  description: { type: String },
});

const CVSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  personalInfo: {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    linkedin: { type: String },
    website: { type: String },
  },
  summary: { type: String },
  workExperience: [WorkExperienceSchema],
  education: [EducationSchema],
  analysisResults: { type: mongoose.Schema.Types.Mixed }, // Field to store AI analysis results
});

module.exports = mongoose.model('CV', CVSchema);