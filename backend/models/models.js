const mongoose = require('mongoose');

const User = mongoose.model('User', {
    username: String,
    password: String,
  });

const BreakfastHistory = mongoose.model('BreakfastHistory', {
    username: String,
    healthinessScore: Number,
    date: String,
})

const BreakfastOption = mongoose.model('BreakfastOptions', {
  name: String,
  user: String,
  healthinessScore: Number,
})

exports.User = User;
exports.BreakfastHistory = BreakfastHistory;
exports.BreakfastOption = BreakfastOption;