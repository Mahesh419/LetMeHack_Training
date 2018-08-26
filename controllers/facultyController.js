const {Faculty} = require('../models/faculty');

const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : true}));

router.post('/faculties', (req, res) => {

  Faculty.findOne({name: req.body.name}, (err, faculty) => {
    if(faculty){
      return res.status(409).send({
        status: 409,
        message: `A faculty with name: ${req.body.name} already exists.`,
        developerMessage: `Faculty creation failed because the faculty name: ${req.body.name} already exists.`,
      });
    }
  });

  let newFaculty = new Faculty({
    name: req.body.name
  });

  newFaculty.save().then((faculty) => {
    if(faculty){
      return res.status(201).send({
        self: `http://localhost:8090/api/faculties/${faculty._id}`,
        name: `${faculty.name}`
      });
    }
  }).catch((err) => {});
});

router.get('/faculties', (req, res) => {

  Faculty.find().then((faculties) => {
    return res.status(200).send({
      faculties: [
        {
          self: `http://localhost:8090/api/faculties/${faculties[0].id}`,
          id: `${faculties[0].id}`,
          name: `${faculties[0].name}`
        }
      ]
    });
  }).catch((err) => {});
});

module.exports = router;
