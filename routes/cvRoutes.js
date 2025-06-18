const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const CV = require('/home/runner/GLASSVOX-MASTER/models/CV'); 
const auth = require('/home/runner/GLASSVOX-MASTER/middleware/auth'); // Adjust the path as necessary

const { generateTextWithFallback } = require('/home/runner/GLASSVOX-MASTER/lib/groq-utils');
// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Store files in an 'uploads' directory

// POST /api/cvs/upload - Upload a new CV for the authenticated user
// This endpoint will need file upload handling logic (e.g., using Multer)
router.post('/upload', auth, upload.single('cvFile'), async (req, res) => {
  try {
    // TODO: Implement file upload handling (e.g., using Multer)
    // The uploaded file will be available in req.file or req.files
    // For now, we'll assume some data is available
    // Access the uploaded file
    const uploadedFile = req.file;
    if (!uploadedFile) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { extractTextFromPDF } = require('/home/runner/GLASSVOX-MASTER/lib/pdf-parser');

    // Read the file buffer
    let extractedText;
    try {
      extractedText = await extractTextFromPDF(uploadedFile.buffer); // Assuming memory storage with Multer
    } catch (pdfError) {
      console.error('PDF extraction failed:', pdfError);
      return res.status(400).json({ message: 'Failed to extract text from PDF', error: pdfError.message });
    }

    // Create a prompt for AI analysis
    const aiPrompt = `Analyze the following CV text and provide the analysis results in a JSON format. Include the following fields: "skills" (an array of strings), "experienceSummary" (a string summarizing work experience), and "educationDetails" (a string summarizing education).\n\nCV Text:\n${extractedText}`;

    let aiAnalysisResults;
    try {
      const aiResponse = await generateTextWithFallback(aiPrompt);
      // Attempt to parse the AI response as JSON
      aiAnalysisResults = JSON.parse(aiResponse);
    } catch (aiError) {
      console.error('AI analysis or parsing failed:', aiError);
      // Continue without AI analysis results or handle differently
      aiAnalysisResults = { error: 'AI analysis failed', details: aiError.message };
    }

    // Create a new CV document and associate with the authenticated user
    const newCV = new CV({
      user: req.user._id, // Get user ID from the authenticated user
      extractedText: extractedText, // Store the extracted text
      analysisResults: aiAnalysisResults, // Store the AI analysis results
      // You can add other CV fields here if needed
    });

    // Associate the CV with the authenticated user
    await newCV.save();

    res.status(201).json({ message: 'CV uploaded successfully', cv: newCV });

  } catch (error) {
    console.error('CV upload error:', error);
    res.status(500).json({ message: 'Server error during CV upload' });
  }
});

// GET /api/cvs/user/:userId - Get the CV associated with a specific user ID
router.get('/user/:userId', auth, async (req, res) => {

  try {
    const userId = req.params.userId;

    // Find the CV associated with the user ID
    let cv;
    try {
      cv = await CV.findOne({ user: userId }).populate('user', 'username email'); // Optionally populate user details
    } catch (dbError) {
      return res.status(500).json({ message: 'Error fetching CV from database', error: dbError.message });
    }

    if (!cv) {
      return res.status(404).json({ message: 'CV not found for this user' });
    }

    // Optional: Restrict viewing CVs to the owner or authorized users
    if (cv.user._id.toString() !== req.user._id.toString()) {
        // return res.status(403).json({ message: 'Unauthorized to view this CV' }); // Uncomment to restrict
    }

    res.status(200).json({ cv });
  } catch (error) { // This catch block will handle errors from population or other unexpected issues
    console.error('Get CV error:', error);
    res.status(500).json({ message: 'Server error fetching CV' });
  }
});

module.exports = router;