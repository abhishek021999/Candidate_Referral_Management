const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer config for PDF only
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};
const upload = multer({ storage, fileFilter });

// @route   POST /candidates
// @desc    Add a new candidate
// @access  User
router.post('/', auth('user'), upload.single('resume'), async (req, res) => {
  try {
    const { name, email, phone, jobTitle } = req.body;
    // Validation
    if (!name || !email || !phone || !jobTitle) {
      return res.status(400).json({ msg: 'All fields except resume are required' });
    }
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: 'Invalid email format' });
    }
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ msg: 'Invalid phone number' });
    }
    let resumeUrl = '';
    if (req.file) {
      resumeUrl = `/uploads/${req.file.filename}`;
    }
    const candidate = new Candidate({
      name,
      email,
      phone,
      jobTitle,
      resumeUrl,
      referredBy: req.user.id,
    });
    await candidate.save();
    res.status(201).json({ msg: 'Candidate referred successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message || 'Server error' });
  }
});

// @route   GET /candidates
// @desc    Get all candidates (with optional search)
// @access  User/Admin
router.get('/', auth(), async (req, res) => {
  try {
    const { jobTitle, status } = req.query;
    let filter = {};
    if (jobTitle) filter.jobTitle = { $regex: jobTitle, $options: 'i' };
    if (status) filter.status = status;
    const candidates = await Candidate.find(filter)
      .sort({ createdAt: -1 })
      .populate('referredBy', 'name email');
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PATCH /candidates/:id/status
// @desc    Update candidate status
// @access  Admin
router.patch('/:id/status', auth('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Reviewed', 'Hired'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value' });
    }
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!candidate) return res.status(404).json({ msg: 'Candidate not found' });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE /candidates/:id
// @desc    Delete a candidate
// @access  Admin
router.delete('/:id', auth('admin'), async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) return res.status(404).json({ msg: 'Candidate not found' });
    res.json({ msg: 'Candidate deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router; 