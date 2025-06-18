const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true // Store emails in lowercase
  },
  password: {
    type: String,
    required: true
  }
});

// Hash the password before saving the user model
userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8); // Use a salt round of 8 or more
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;