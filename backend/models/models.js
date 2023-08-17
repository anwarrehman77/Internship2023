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

exports.User = User;
exports.BreakfastHistory = BreakfastHistory;