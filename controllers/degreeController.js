const {Degree} = require('../models/degree');
const {Department} = require('../models/department');

const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.post('/degrees', (req, res) => {
  Degree.findOne({name: req.body.name}).then((degree) => {
    if(degree){
      res.status(409).send();
    }else{

      let degree = new Degree({
        name: req.body.name,
        department_id: req.body.department_id
      });

        let dept = null;

      Department.findOne({_id: req.body.department_id}).then((department) => {
        if(department){
          dept = department;
        }
      });

      degree.save().then((degree) => {
        res.status(201).send({
          self: `http://localhost:8090/api/degrees/${req.body.department_id}`,
          name: `${req.body.name}`,
          department: {
            self: `http://localhost:8090/api/departments/${dept._id}`,
            name: `${dept.name}`
          }
        });
      }).catch((err) => {
        console.log(err);
      });

    }
  }).catch((err) => {
    console.log('POST/degrees', err);
  });
});

router.get('/degrees', (req, res) => {
  let dept_id = req.query.department;
  let degreeList = [];

  if(dept_id){
    Degree.find({department_id: dept_id}).then((degrees) => {

      degrees.forEach((degree) => {
        degreeList.push({
          self: `http://localhost:8090/api/degrees/${dept_id}`,
          id: `${degree._id}`,
          name: `${degree.name}`
        });
      });

      res.status(200).send({
        degrees: degreeList
      });

    }).catch((err) => {
      console.log('GET/degrees', err);
    });
  }else{
    Degree.find().then((degrees) => {
      degrees.forEach((degree) => {
        degreeList.push({
          self: `http://localhost:8090/api/degrees/${degree._id}`,
          id: `${degree._id}`,
          name: `${degree.name}`
        });
      });

      res.status(200).send({
        degrees: degreeList
      });

    }).catch((err) => {
      console.log('GET/degrees', err);
    });
  }
});

module.exports = router;
