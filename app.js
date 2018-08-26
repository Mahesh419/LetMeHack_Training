require('./server');

const {mongoose} = require('./db/mongoose');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

//app.use(bodyParser.json());

const port = process.env.PORT || 8090;

const user = require('./controllers/userController');
const faculty = require('./controllers/facultyController');
const department = require('./controllers/departmentController');

router.get('/', (req, res) => {
  res.status(200).send();
});

app.use('/api', router);
app.use('/api', user);
app.use('/api', faculty);
app.use('/api', department);

module.exports = app;
