const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const auth = require('/home/runner/GLASSVOX-MASTER/middleware/auth');
const CV = require('/home/runner/GLASSVOX-MASTER/models/CV');
const cvRoutes = require('/home/runner/GLASSVOX-MASTER/routes/cvRoutes');
const jobRoutes = require('/home/runner/GLASSVOX-MASTER/routes/jobRoutes');
const Job = require('/home/runner/GLASSVOX-MASTER/models/job'); // Import the Job model
const port = 3001; // Or any port you prefer
const User = require('/home/runner/GLASSVOX-MASTER/models/User'); // Assuming models directory is at the root

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/GLASSBOX-MASTER', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware to parse JSON bodies
app.use(express.json());

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save user to database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT (replace 'YOUR_JWT_SECRET' with a strong secret in production)
    const token = jwt.sign({ userId: user._id }, 'YOUR_JWT_SECRET', { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});


// Get authenticated user details endpoint
app.get('/api/user', auth, (req, res) => {
  res.json(req.user); // req.user is set by the auth middleware
});
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});