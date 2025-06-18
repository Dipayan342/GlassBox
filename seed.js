const mongoose = require('mongoose');

// Define the Job Schema and Model
const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
  },
  requirements: {
    type: String,
  },
});

const Job = mongoose.model('Job', JobSchema);

// Sample job data
const sampleJobs = [
  {
    title: 'Frontend Developer',
    company: 'Tech Solutions Inc.',
    location: 'San Francisco, CA',
    salary: '$100,000 - $120,000',
    requirements: 'React, JavaScript, HTML, CSS',
  },
  {
    title: 'Backend Engineer',
    company: 'Data Innovators',
    location: 'New York, NY',
    salary: '$110,000 - $130,000',
    requirements: 'Node.js, Express, MongoDB, REST APIs',
  },
  {
    title: 'Full Stack Developer',
    company: 'Web Services Co.',
    location: 'Remote',
    salary: '$105,000 - $125,000',
    requirements: 'React, Node.js, MongoDB, AWS',
  },
  {
    title: 'Data Scientist',
    company: 'Analytics Gurus',
    location: 'Seattle, WA',
    salary: '$120,000 - $140,000',
    requirements: 'Python, R, Machine Learning, SQL',
  },
];

// Connect to MongoDB and insert data
mongoose.connect('mongodb://localhost/GLASSBOX-MASTER', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected for seeding');
    // Optional: Clear existing data before inserting
    // return Job.deleteMany({});
  })
  .then(() => {
    console.log('Inserting sample jobs...');
    return Job.insertMany(sampleJobs);
  })
  .then(() => {
    console.log('Sample jobs inserted successfully!');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error during seeding:', err);
    mongoose.connection.close();
  });