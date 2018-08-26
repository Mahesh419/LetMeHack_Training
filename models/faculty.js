const mongoose = require('mongoose');

let Faculty = mongoose.model('Faculty', {
  name: {
    type: String,
    required: true
  }
});

module.exports = {Faculty};
