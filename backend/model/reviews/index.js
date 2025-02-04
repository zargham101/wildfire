const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  timesstamp: true
})

module.exports = mongoose.model('Review', ReviewSchema);