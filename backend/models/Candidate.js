const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  jobTitle: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Reviewed', 'Hired'], default: 'Pending' },
  resumeUrl: { type: String },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Candidate', CandidateSchema); 