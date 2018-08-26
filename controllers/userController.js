const {User} = require('../models/user');
const {Password} = require('../tools/validation');
const {Mobile} = require('../tools/validation');
const {Role} = require('../tools/validation');

const express = require('express');
const bodyParser = require('body-parser');
const objectPath = require('object-path');

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : true}));

router.post('/users', (req, res) => {

  if(!req.body.email){
    res.status(400).send();
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

    let user = new User({
      email: req.body.email,
      password: pw
    });

    const saveUser = (user) => {
      console.log(user);
      user.save().then((user) => {
        if(!user){
          return res.status(400).send();
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


    if(mobile){
      objectPath.set(user, "mobile", mobile);
    }
    if(role){
      objectPath.set(user, "role", role);
    }

    saveUser(user);
});



module.exports = router;
