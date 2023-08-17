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

// Mongoose Models
const User = mongoose.model('User', {
  username: String,
  password: String,
});
const BreakfastHistory = mongoose.model('BreakfastHistory', {
    username: String,
    healthinessScore: Number,
    date: String,
})

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
  const { username, scores, date } = req.body;

  try {
    const existingSubmission = await BreakfastHistory.findOne({ date: date });

    if (existingSubmission) {
      res.json({ success: false, message: `You already submitted a breakfast today (${date})` });
    } else {
      let score = 0;
      scores.forEach(element => {
        score += element;
      });
      score /= scores.length;
      score = +score.toFixed(2);

      const newBreakfastHistory = new BreakfastHistory({
        username: username,
        healthinessScore: score,
        date: date,
      });
      await newBreakfastHistory.save();

      res.json({ success: true, message: `Saved today's breakfast! Here's your score: ${score}` });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'There was an error. Try again later.' });
  }
});

app.post('/getaveragescore', async (req, res) => {
  const username = req.body.username;
  let averageScore = 0;

  try {
    const docs = await BreakfastHistory.find({ username: username });

    if (docs == []) {
      res.json({ success: false, message: "No history found :("});
    } else {
      docs.forEach(element => {
        averageScore += element.healthinessScore;
      });
      averageScore /= docs.length;
      averageScore = +averageScore.toFixed(2);

      res.json({ success: true, message: `Score: ${averageScore}` });
    }


  } catch (error) {
    res.status(500).json({ success: false, message: 'An error occurred' });
  }  
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
