const express = require('express');
const router = express.Router();

const models = require('../models/models');
const User = models.User;
const BreakfastHistory = models.BreakfastHistory;

router.post('/register', async (req, res) => {
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

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });

  if (user) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

router.post('/savetoday', async (req, res) => {
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

router.post('/getaveragescore', async (req, res) => {
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

module.exports = router;