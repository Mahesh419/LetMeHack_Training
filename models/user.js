const mongoose = require('mongoose');

let User = mongoose.model('Users', {
  email: {
    type: String,
    required: true
  },
  password: {
    type: String
  }
});

module.exports = {User}
