const {User} = require('../models/user');
const {Password} = require('../tools/validation');
const {Mobile} = require('../tools/validation');
const {Role} = require('../tools/validation');
const {Degree} = require('../models/degree');
const {Department} = require('../models/department');
const {Faculty} = require('../models/faculty');

const express = require('express');
const bodyParser = require('body-parser');
const objectPath = require('object-path');

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : true}));

let degTemp = null;
let deptTemp = null;
let facTemp = null;

router.post('/users', (req, res) => {

  if(!req.body.email){
    return res.status(400).send();
  }

  User.find({email: req.body.email}).then((users) => {
    if(users.length !== 0){
      return res.status(409).send({
        status: 409,
        message: `A user with email: ${req.body.email} already exists.`,
        developerMessage: `User creation failed because the email: ${req.body.email} already exists.`,
      });
    }
  }).catch((err) => {
    console.log(err);
  });

    let pw = Password(req.body.password);

    if(pw === null){
      return res.status(400).send({
        status: 400,
        message: `Password complexity requirement not met`,
        developerMessage: `User creation failed because password complexity requirement not met`
      });
    }


    const saveUser = (user) => {
      user.save().then((user) => {
        if(!user){
          return res.status(400).send();
        }
        //console.log(2, user.faculty_id , user.department_id , user.degree_id);
        if(user.faculty_id && user.department_id && user.degree_id){

          Faculty.findOne({_id: user.faculty_id}).then((faculty) => {
            if(faculty){
              facTemp = faculty;

              Department.findOne({_id: user.department_id}).then((department) => {
                if(department){
                  deptTemp = department;

                  Degree.findOne({_id: user.degree_id}).then((degree) => {
                    if(degree){
                      degtTemp = degree;

                      return res.status(201).send({
                        self: `http://localhost:8090/api/users/${user._id}`,
                        email: `${req.body.email}`,
                        role: `${req.body.role}`,
                        first_name: `${user.first_name}`,
                        last_name: `${user.last_name}`,
                        batch: `${user.batch}`,
                        faculty: {
                          self: `http://localhost:8090/api/faculties/${facTemp._id}`,
                          name: `${facTemp.name}`
                        },
                        department: {
                          self: `http://localhost:8090/api/departments/${deptTemp._id}`,
                          name: `${deptTemp.name}`
                        },
                        degree: {
                          self: `http://localhost:8090/api/degrees/${degTemp._id}`,
                          name: `${degTemp.name}`
                        }
                      });
                    }
                  }).catch((err) => {
                    console.log(err);
                  });
                }
              }).catch((err) => {
                console.log(err);
              });
            }
          }).catch((err) => {
            console.log(err);
          });
        }

        if(user.mobile){
          return res.status(201).send({
            self: `http://localhost:8090/api/users/${user._id}`,
            email: `${req.body.email}`,
            mobile: `${req.body.mobile}`
          });
        }

          return res.status(201).send({
            self: `http://localhost:8090/api/users/${user._id}`,
            email: `${req.body.email}`,
            role: `${user.role}`
          });

      }).catch((err) => {
        console.log(err);
      });
    };

    let user = new User({
      email: req.body.email,
      password: pw
    });

    let mobile = Mobile(req.body.mobile);
    let role;
    if(req.body.role){
      role = Role(req.body.role);

      if(!role){
        res.status(400).send();
      }
    }else{
      role = 'user';
    }

    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let faculty_id = req.body.faculty_id;
    let dept_id = req.body.department_id;
    let degree_id = req.body.degree_id;
    let batch = req.body.batch;

    //if(faculty_id && dept_id && degree_id){
      objectPath.set(user, "first_name", first_name);
      objectPath.set(user, "last_name", last_name);
      objectPath.set(user, "faculty_id", faculty_id);
      objectPath.set(user, "department_id", dept_id);
      objectPath.set(user, "degree_id", degree_id);
      objectPath.set(user, "batch", batch);
      objectPath.set(user, "mobile", mobile);
      objectPath.set(user, "role", role);
    // }else{
    //   if(mobile){
    //     objectPath.set(user, "mobile", mobile);
    //   }
    //   if(role){
    //     objectPath.set(user, "role", role);
    //   }
    // }

    saveUser(user);
});



module.exports = router;
