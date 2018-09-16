const {mongoose} = require('./db/mongoose');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

const port = process.env.PORT || 8090;

const user = require('./controllers/userController');
const faculty = require('./controllers/facultyController');
const department = require('./controllers/departmentController');
const degree = require('./controllers/degreeController');

router.get('/', (req, res) => {
  res.status(200).send();
});

router.get('/loadtest/:limit', (req, res) => {
  let reqLimit = req.params.limit;
  let i = 0;

  for(i = 0; i < reqLimit; i++){
    res.status(200).send({
      timestamp: new Date(),
      defect: false
    });
  }
});

app.use('/api', router);
app.use('/api', user);
app.use('/api', faculty);
app.use('/api', department);
app.use('/api', degree);

module.exports = app;
