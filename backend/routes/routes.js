const express = require('express');
const router = express.Router();

const models = require('../models/models');
const User = models.User;
const BreakfastHistory = models.BreakfastHistory;
const BreakfastOption = models.BreakfastOption;

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

router.post('/savetohist', async (req, res) => {
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

router.post('/saveoptions', async (req, res) => {
  optionName = req.body.name;
  optionUser = req.body.user;
  optionScore = req.body.score;
  
  try {
    const existingOption = await BreakfastOption.findOne({ name: optionName });

    if (existingOption) {
      res.json({ success: false, message: 'That option already exists!' });
    } else {
      if (optionScore > 5) {
        optionScore = 5;
      } else if (optionScore <1) {
        optionScore = 1;
      }

      const newOption = BreakfastOption({
        name: optionName,
        user: optionUser,
        healthinessScore: optionScore,
      });

      await newOption.save();

      res.json({ success: true, message: `Saved ${optionName} with ${optionScore}` });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
});

router.post('/getoptions', async (req, res) => {
  const username = req.body.name;

  try {
    const options = await BreakfastOption.find({user: username});

    if (options.length === 0) {
      res.json({ success: false, message: 'No options found' });
    } else {
      const optionNames = options.map(option => option.name);
      const optionScores = options.map(option => option.healthinessScore);
      
      res.json({ success: true, names: optionNames, scores: optionScores, message: `Found ${options.length} options.` });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
});

module.exports = router;