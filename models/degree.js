const mongoose = require('mongoose');

let Degree = mongoose.model('Degree', {
  name: {
    type: String,
    required: true
  },
  department_id: {
    type: String,
    required: true
  }
});

module.exports = {Degree};
