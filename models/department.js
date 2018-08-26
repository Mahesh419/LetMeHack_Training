const mongoose = require('mongoose');

let Department = mongoose.model('Department', {
  name: {
    type: String,
    required: true
  },
  faculty_id: {
    type: String,
    required: true
  }
});

module.exports = {Department}
