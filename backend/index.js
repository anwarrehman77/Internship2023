const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 8080;

const connectionString = "mongodb+srv://anwarrehman77:sKHlvAIDmx2vMPfo@betterbreakfast.fpnwgkf.mongodb.net/Test";

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = mongoose.model('User', {
  username: String,
  password: String,
});

const BreakfastOption = mongoose.model('BreakfastOption', {
    name: String,
    healthinessScore: Number
})

// Login API's
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ username });
  
      if (existingUser) {
        res.json({ success: false, message: 'Username already taken' });
      } else {
        const newUser = new User({ username, password });
        await newUser.save();
        res.json({ success: true, message: 'Registration successful' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'An error occurred' });
    }
  });
  

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });

  if (user) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/savetoday', async (req, res) => {
  const scores = req.body.scores;
  let score = 0;

  scores.forEach(element => {
    score += element;
  });
  score /= scores.length;

  res.json({ success: true, message: `Saved ${score}`});
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
