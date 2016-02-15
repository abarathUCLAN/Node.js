var express = require('express');
var passport = require('passport');
var router = express.Router();
var crypto = require('crypto');

var libs = process.cwd() + '/libs/';

var db = require(libs + 'db/mongoose');
var User = require(libs + 'model/user');
var Token = require(libs + 'model/accessToken');
var RefreshToken = require(libs + 'model/refreshToken');
var iz = require('iz'),
  are = iz.are,
  validators = iz.validators;

var winston = require('winston');
var path = require('path');
var filename = path.join(process.cwd(), '/logs/created-logfile.log');
var logger = new(winston.Logger)({
  transports: [
    new(winston.transports.File)({
      filename: filename
    })
  ]
});

router.get('/changeData', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    User.findOne({
      _id: req.user.userId
    }, function(error, result) {
      if (error) throw err;
      res.json({
        firstname: result.firstname,
        lastname: result.lastname,
        email: result.username
      });
    });
  }
);

router.post('/logout', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    Token.find({
      userId: req.user.userId
    }).remove(function(error, result) {
      if (error) throw error;
      RefreshToken.find({
        userId: req.user.userId
      }).remove(function(err, resu) {
        if (err) throw err;
        res.statusCode = 200;
        res.end();
      });
    });
  });


router.post('/changeData', passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    var rules = are({
      firstname: iz(req.body.firstname).required(),
      firstname: iz(req.body.firstname).minLength(2),
      firstname: iz(req.body.firstnamee).maxLength(25),
      password: iz(req.body.password).required(),
      password: iz(req.body.password).minLength(5),
      lastname: iz(req.body.lastname).required(),
      lastname: iz(req.body.lastname).minLength(2),
      lastname: iz(req.body.lastname).maxLength(25)
    });
    User.findById(req.user.userId,
      function(err, doc) {
        if (err) throw err;
        var changeData = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          password: req.body.password
        };
        if (rules.validFor(changeData)) {
          doc.firstname = changeData.firstname;
          doc.lastname = changeData.lastname;
          doc.password = changeData.password;
          doc.save(function(error, result) {
            if (error) throw error;
            else {
              res.statusCode = 200;
              res.end();
            }
          });
        } else {
          res.statusCode = 400;
          res.json("Validation failed.");
        }
      });
  });


router.post('/register', function(req, res) {
  var user = new User({
    username: req.body.email,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname
  });
  var rules = are({
    firstname: iz(user.firstname).required(),
    firstname: iz(user.firstname).minLength(2),
    firstname: iz(user.firstname).maxLength(25),
    password: iz(user.password).required(),
    password: iz(user.password).minLength(5),
    username: iz(user.username).required().email(),
    lastname: iz(user.lastname).required(),
    lastname: iz(user.lastname).minLength(2),
    lastname: iz(user.lastname).maxLength(25)
  });
  if (rules.validFor(user)) {
    user.save(function(err, user) {
      if (!err) {
        res.statusCode = 200;
        res.json(user);
      } else {
        logger.log('info', 'Username ' + req.body.email + ' already taken.');
        res.statusCode = 400;
        res.json(err);
      }
    });
  } else {
    res.statusCode = 400;
    logger.log('info', 'Registration failed with username: ' + req.body.email);
    res.json("Validation failed.");
  }
});

router.post('/getUserByEmail', function(req, res) {
  User.findOne({
    username: req.body.email
  }, 'firstname lastname username', function(error, result) {
    if (error) throw new err;
    if (result === null) {
      res.statusCode = 400;
      res.end();
    } else {
      res.statusCode = 200;
      res.json(new Array({
        email: result.username,
        firstname: result.firstname,
        lastname: result.lastname
      }));
    }
  });
});

router.get('/rights/:id(\\d+)' ,passport.authenticate('bearer', {
    session: false
  }),
  function(req, res) {
    User.findOne({
      username: req.body.email
    }, 'firstname lastname username', function(error, result) {
      if (error) throw new err;
      if (result === undefined) {
        res.statusCode = 400;
        res.end();
      } else {
        res.statusCode = 200;
        res.json(new Array({
          email: result.username,
          firstname: result.firstname,
          lastname: result.lastname
        }));
      }
    });
  });

module.exports = router;

function encryptPassword(password, salt) {
  return crypto.createHmac('sha1', salt).update(password).digest('hex');
};
