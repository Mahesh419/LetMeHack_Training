const {Department} = require('../models/department');
const {Faculty} = require('../models/faculty');

const {ObjectID} = require('mongodb');

const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : true}));

let faculty;

router.post('/departments', (req, res) => {

  let newFaculty = (request) => {
    return new Promise((resolve, reject) => {
        Faculty.find({_id: request.body.faculty_id}).then((fac) => {
          resolve(fac);
        }).catch((err) => {
          reject(err);
        });
    });
  };

  let newDepartment = (request) => {
    return new Promise((resolve, reject) => {
      Department.find({name: request.body.name}).then((dept) => {
        if(dept !== null){
          resolve(dept);
        }
      }).catch((err) => {
        reject(err);
      });
    });
  };

newFaculty(req).then((fac) => {
    if(!fac && fac === null){
      return res.status(400).send();
    }
    faculty = fac;
  }).catch((err) => {
    return res.status(400).send();
  });

  newDepartment(req).then((dept) => {
    if(dept.length !== 0){
      return res.status(409).send({
        status: 409,
        message: `A department with name: ${dept.name} already exists.`,
        developerMessage: `Department creation failed because the department name: ${dept.name} already exists.`,
      });
    }
  }).catch((err) => {});

  let tempDept = new Department({
    name: req.body.name,
    faculty_id: req.body.faculty_id
  });

  tempDept.save().then((department) => {
    return res.status(201).send({
      self: `http://localhost:8090/api/departments/${department._id}`,
      name: `${department.name}`,
      faculty: {
        self: `http://localhost:8090/api/faculties/${faculty[0]._id}`,
        name: `${faculty.name}`
      }
    });
  }).catch((err) => {});

});

module.exports = router;
